import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

@Entity('tasks')
@Unique(['orderUuid'])
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'simple-enum', enum: TaskStatus, default: TaskStatus.TODO })
    status: TaskStatus;

    @Column({ type: 'simple-enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;

    @Column({ nullable: true })
    deadline: Date;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    assigneeId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigneeId' })
    assignee: User;

    @Column({ nullable: true })
    orderUuid: string;

    @Column({ default: 1 })
    difficulty: number;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({ nullable: true })
    createdById: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('task_activities')
export class TaskActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskId: string;

    @Column()
    action: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ nullable: true })
    actorId: number;

    @CreateDateColumn()
    createdAt: Date;
}
