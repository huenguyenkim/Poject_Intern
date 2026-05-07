import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { TaskTriggerService } from './task-trigger.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard, RolesGuard } from '../infrastructure/auth/jwt-auth.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';
import { UserRole } from '../common/constants/user-role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskTriggerService: TaskTriggerService
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Post('trigger')
  @Roles(UserRole.ADMIN)
  async triggerTask(@Body() body: { orderUuid: string }, @Res() res: Response) {
    const task = await this.taskTriggerService.createOrderTask(body.orderUuid);
    if (task) {
        return res.status(HttpStatus.CREATED).json(task);
    } else {
        return res.status(HttpStatus.OK).json({ message: 'Task already exists' });
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAll(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('tags') tags?: string
  ) {
    const user = req.user;
    let targetAssigneeId = assigneeId ? +assigneeId : undefined;
    
    // IDOR Protection: Staff can only list their own tasks
    if (user.role === UserRole.STAFF) {
        targetAssigneeId = user.id;
    }

    const priorities = priority ? priority.split(',').filter(Boolean) : undefined;
    const tagList = tags ? tags.split(',').filter(Boolean) : undefined;
    return this.tasksService.findAll(page ? +page : 1, limit ? +limit : 10, targetAssigneeId, status, priorities, tagList);
  }

  @Post('scan-alerts')
  @Roles(UserRole.ADMIN)
  scanAlerts() {
    return this.tasksService.scanSmartAlerts();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const task = await this.tasksService.findOne(id);
    // IDOR Protection: Staff can only view their own tasks
    if (req.user.role === UserRole.STAFF && task.assigneeId !== req.user.id) {
        throw new ForbiddenException('Bạn không có quyền truy cập công việc này');
    }
    return task;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: any) {
    const task = await this.tasksService.findOne(id);
    
    // IDOR Protection: Staff can only update their own tasks, and only the status
    if (req.user.role === UserRole.STAFF) {
        if (task.assigneeId !== req.user.id) {
            throw new ForbiddenException('Bạn không có quyền cập nhật công việc này');
        }
        const allowedUpdates = { status: updateTaskDto.status };
        return this.tasksService.update(id, allowedUpdates as UpdateTaskDto, req.user.id);
    }

    // Admin can update anything
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.remove(id, req.user.id);
  }
}
