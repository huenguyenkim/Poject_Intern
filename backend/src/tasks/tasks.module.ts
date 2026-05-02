import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task, TaskActivity } from './entities/task.entity';
import { TaskTriggerService } from './task-trigger.service';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskGateway } from './task.gateway';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, TaskActivity, User]),
        AuthModule,
        NotificationsModule
    ],
    controllers: [TasksController],
    providers: [TaskTriggerService, TasksService, TaskGateway],
    exports: [TaskTriggerService, TasksService],
})
export class TasksModule { }
