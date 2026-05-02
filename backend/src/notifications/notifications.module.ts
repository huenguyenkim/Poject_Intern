import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../infrastructure/auth/auth.module';
import { User } from '../users/entities/user.entity'; // <-- Thêm dòng này

@Module({
  // Thêm User vào mảng forFeature
  imports: [TypeOrmModule.forFeature([Notification, User]), AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationGateway],
  exports: [NotificationsService],
})
export class NotificationsModule { }