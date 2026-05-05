import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async findAllForUser(userId: number) {
    return this.notificationRepository.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async markAsRead(id: number, userId: number) {
    await this.notificationRepository.update({ id, recipientId: userId }, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update({ recipientId: userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async createNotification(data: {
    recipientId: number;
    title: string;
    content: string;
    type: 'ORDER' | 'SYSTEM' | 'TASK' | 'MESSAGE';
    relatedId?: string;
  }) {
    const notification = this.notificationRepository.create(data);
    const saved = await this.notificationRepository.save(notification);

    // Phát real-time
    this.notificationGateway.sendNotificationToUser(data.recipientId, saved);
    
    return saved;
  }

  async notifyAdmins(title: string, content: string, type: any = 'SYSTEM') {
    // Trong thực tế sẽ lấy danh sách admin từ DB, tạm thời phát vào room admin-dashboard
    this.notificationGateway.sendToRole('admin', { title, content, type, createdAt: new Date() });
  }
}
