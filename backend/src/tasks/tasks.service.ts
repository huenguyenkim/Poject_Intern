import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Task, TaskActivity, TaskPriority, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/constants/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskActivity)
    private readonly activityRepo: Repository<TaskActivity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly taskGateway: TaskGateway,
  ) {}

  onModuleInit() {
    setInterval(() => {
      this.scanSmartAlerts().catch((error) => console.error('Task alert scan failed', error));
    }, 60 * 60 * 1000);
  }

  async create(createTaskDto: CreateTaskDto, actorId?: number): Promise<Task> {
    const task = this.taskRepo.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      difficulty: createTaskDto.difficulty || 1,
      createdById: actorId || createTaskDto.createdById,
    });
    const saved = await this.taskRepo.save(task);
    await this.recordActivity(saved.id, 'CREATE', `Created task "${saved.title}"`, actorId, saved);
    this.taskGateway.emitTaskEvent('taskCreated', saved);
    return saved;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    assigneeId?: number,
    status?: string,
    priorities?: string[],
    tags?: string[],
  ): Promise<{ data: Task[]; total: number; stats: any; alerts: any[]; timeline: any[]; workload: any[]; activities: TaskActivity[] }> {
    const skip = (page - 1) * limit;
    const query = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee');

    if (assigneeId) query.andWhere('task.assigneeId = :assigneeId', { assigneeId });
    if (status) query.andWhere('task.status = :status', { status });
    if (priorities?.length) query.andWhere('task.priority IN (:...priorities)', { priorities });
    if (tags?.length) {
      tags.forEach((tag, index) => {
        query.andWhere(`task.tags LIKE :tag${index}`, { [`tag${index}`]: `%${tag}%` });
      });
    }

    query.skip(skip).take(limit).orderBy('task.createdAt', 'DESC');
    const [data, total] = await query.getManyAndCount();

    const [stats, alerts, timeline, workload, activities] = await Promise.all([
      this.getStats(assigneeId),
      this.getSmartAlerts(),
      this.getTimeline(),
      this.getWorkload(),
      this.activityRepo.find({ order: { createdAt: 'DESC' }, take: 20 }),
    ]);

    return { data, total, stats, alerts, timeline, workload, activities };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['assignee'] });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, actorId?: number): Promise<Task> {
    const task = await this.findOne(id);
    const previousStatus = task.status;
    const previousDeadline = task.deadline;
    Object.assign(task, updateTaskDto);
    const saved = await this.taskRepo.save(task);

    let message = `Updated task "${saved.title}"`;
    if (updateTaskDto.status && updateTaskDto.status !== previousStatus) {
      message = `Status changed from ${previousStatus} to ${updateTaskDto.status}`;
    } else if (updateTaskDto.deadline && String(updateTaskDto.deadline) !== String(previousDeadline)) {
      message = `Deadline changed to ${new Date(updateTaskDto.deadline).toLocaleString()}`;
    }

    await this.recordActivity(saved.id, 'UPDATE', message, actorId, saved);
    this.taskGateway.emitTaskEvent('taskUpdated', saved);
    return saved;
  }

  async remove(id: string, actorId?: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
    await this.recordActivity(id, 'DELETE', `Deleted task "${task.title}"`, actorId);
    this.taskGateway.emitTaskEvent('taskDeleted', { id });
  }

  async scanSmartAlerts() {
    const dueSoon = await this.getSmartAlerts();
    const admins = await this.userRepo.find({ where: { role: UserRole.ADMIN } });

    await Promise.all(dueSoon.map(async (task) => {
      await Promise.all(admins.map((admin) => this.notificationsService.createNotification({
        recipientId: admin.id,
        title: 'High priority task due soon',
        content: `${task.title} is due within 2 hours.`,
        type: 'TASK',
        relatedId: task.id,
      })));
      this.taskGateway.emitTaskEvent('taskAlert', task);
    }));

    return { alerts: dueSoon.length };
  }

  private async getStats(assigneeId?: number) {
    const query = this.taskRepo.createQueryBuilder('task');
    if (assigneeId) query.where('task.assigneeId = :assigneeId', { assigneeId });

    const tasks = await query.getMany();
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === TaskStatus.DONE).length;
    const overdue = tasks.filter((task) => task.deadline && task.deadline < new Date() && task.status !== TaskStatus.DONE).length;

    return {
      todo: tasks.filter((task) => task.status === TaskStatus.TODO).length,
      doing: tasks.filter((task) => task.status === TaskStatus.DOING).length,
      done,
      total,
      overdue,
      high: tasks.filter((task) => task.priority === TaskPriority.HIGH && task.status !== TaskStatus.DONE).length,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    };
  }

  private async getSmartAlerts() {
    const now = new Date();
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .where('task.priority = :priority', { priority: TaskPriority.HIGH })
      .andWhere('task.status != :done', { done: TaskStatus.DONE })
      .andWhere('task.deadline BETWEEN :now AND :inTwoHours', { now, inTwoHours })
      .orderBy('task.deadline', 'ASC')
      .getMany();
  }

  private async getTimeline() {
    const tasks = await this.taskRepo.find({ relations: ['assignee'], order: { deadline: 'ASC' } });
    return tasks.map((task) => ({
      ...task,
      hasOverlap: tasks.some((other) => (
        other.id !== task.id &&
        other.assigneeId &&
        task.assigneeId &&
        other.assigneeId === task.assigneeId &&
        this.rangesOverlap(task.startDate || task.createdAt, task.deadline, other.startDate || other.createdAt, other.deadline)
      )),
    }));
  }

  private async getWorkload() {
    const staff = await this.userRepo.find({ where: { role: UserRole.STAFF } });
    const tasks = await this.taskRepo.find({ where: { status: Not(TaskStatus.DONE) } });

    return staff.map((user) => {
      const assigned = tasks.filter((task) => task.assigneeId === user.id);
      const totalPoints = assigned.reduce((sum, task) => sum + (Number(task.difficulty) || 1), 0);
      return {
        userId: user.id,
        fullName: user.fullName,
        totalPoints,
        taskCount: assigned.length,
        overloaded: totalPoints > 40,
      };
    });
  }

  private rangesOverlap(startA?: Date, endA?: Date, startB?: Date, endB?: Date) {
    if (!startA || !endA || !startB || !endB) return false;
    return new Date(startA) <= new Date(endB) && new Date(startB) <= new Date(endA);
  }

  private async recordActivity(taskId: string, action: string, message: string, actorId?: number, task?: Task) {
    const activity = await this.activityRepo.save(this.activityRepo.create({ taskId, action, message, actorId }));
    this.taskGateway.emitTaskEvent('taskActivity', { ...activity, assigneeId: task?.assigneeId });
    return activity;
  }
}
