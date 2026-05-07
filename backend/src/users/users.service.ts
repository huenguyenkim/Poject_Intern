import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../common/constants/user-role.enum';
import { AuditService } from '../audit/audit.service';
import { IHashingService } from '../core/application/usecases/AuthUseCases';
import { NotificationsService } from '../notifications/notifications.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
    private readonly hashingService: IHashingService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number, withDeleted = false) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      withDeleted: withDeleted
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>) {
    if (data.email) {
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(
    id: number, 
    data: Partial<User>,
    metadata: { userId?: number; ip?: string; ua?: string } = {}
  ) {
    const existing = await this.findOne(id);

    // Audit sensitive field: Role
    const isRoleChanged = data.role && data.role !== existing.role;

    if (isRoleChanged) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update(User, id, data);
        
        await this.auditService.record(queryRunner.manager, {
          tableName: 'users',
          recordId: id,
          actionType: 'UPDATE',
          fieldName: 'role',
          oldValue: existing.role,
          newValue: data.role,
          userId: metadata.userId || 0,
          ipAddress: metadata.ip,
          userAgent: metadata.ua,
          isSensitive: true,
        });

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } else {
      await this.userRepository.update(id, data);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // SOFT DELETE: Use softRemove to trigger DeleteDateColumn
    return this.userRepository.softRemove(user);
  }

  async restore(id: number) {
    const user = await this.findOne(id, true);
    return this.userRepository.recover(user);
  }

  /**
   * Logic Đổi mật khẩu bảo mật cao
   */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    // 1. Lấy user bao gồm password (select: false)
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.password')
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    // 2. Kiểm tra mật khẩu hiện tại
    const isMatch = await this.hashingService.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác.');
    }

    // 3. Kiểm tra mật khẩu mới không trùng mật khẩu cũ
    const isSameAsOld = await this.hashingService.compare(dto.newPassword, user.password);
    if (isSameAsOld) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
    }

    // 4. Kiểm tra khớp Confirm Password
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Xác nhận mật khẩu mới không khớp.');
    }

    // 5. Cập nhật và Hủy Session (increment tokenVersion)
    user.password = await this.hashingService.hash(dto.newPassword);
    user.tokenVersion += 1;
    user.lastPasswordChangeAt = new Date();
    
    await this.userRepository.save(user);

    // 6. Gửi Email thông báo (Async)
    setImmediate(async () => {
      try {
        await this.notificationsService.createNotification({
          recipientId: user.id,
          title: 'Security Alert: Password Changed 🛡️',
          content: 'The password for your account was recently changed. If you did not perform this action, please contact support immediately.',
          type: 'SYSTEM'
        });
      } catch (err) {
        console.error('Failed to send security notification', err);
      }
    });

    return { success: true, message: 'Password updated successfully. Please log in again on other devices.' };
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !user;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !user;
  }

  async checkPhoneAvailability(phone: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { phone } });
    return !user;
  }
}
