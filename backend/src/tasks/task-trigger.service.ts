import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Task, TaskPriority } from './entities/task.entity';

@Injectable()
export class TaskTriggerService {
    private readonly logger = new Logger(TaskTriggerService.name);
    constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) { }

    async createOrderTask(orderUuid: string) {
        try {
            const shortId = orderUuid.split('-')[0].toUpperCase();
            const task = this.taskRepo.create({ 
                orderUuid,
                title: `Đóng gói đơn hàng #${shortId}`,
                description: 'Nhiệm vụ tự động tạo từ hệ thống khi đơn hàng được xác nhận.',
                priority: TaskPriority.HIGH
            });
            return await this.taskRepo.save(task);
        } catch (error) {
            // [CẬP NHẬT] Hỗ trợ bắt lỗi trùng lặp cho cả SQLite và MySQL
            const isDuplicateError =
                (error instanceof QueryFailedError) &&
                (error.message.includes('ER_DUP_ENTRY') || error.message.includes('UNIQUE constraint failed'));

            if (isDuplicateError) {
                this.logger.warn(`[Idempotency] Task cho order ${orderUuid} đã tồn tại. Ngăn chặn Race-condition thành công.`);
                return null;
            }

            // Nếu là lỗi khác thì mới throw 500
            throw error;
        }
    }
}