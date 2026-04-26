import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../common/constants/user-role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
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
}
