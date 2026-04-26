import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../core/domain/repositories/IUserRepository';
import { User as DomainUser } from '../../../core/domain/entities/User';
import { User as UserEntity } from '../../../users/entities/user.entity';

/**
 * TypeORM Implementation of IUserRepository
 */
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<DomainUser | null> {
    const item = await this.repository.findOne({ where: { id } });
    return item ? this.mapToDomain(item) : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    // Explicitly select password for auth checks
    const item = await this.repository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    
    return item ? this.mapToDomain(item) : null;
  }

  async create(user: Partial<DomainUser>): Promise<DomainUser> {
    const entity = this.repository.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async update(id: number, user: Partial<DomainUser>): Promise<DomainUser> {
    await this.repository.update(id, {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: UserEntity): DomainUser {
    return DomainUser.create({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      password: (entity as any).password, // Extract password if it was selected
      deletedAt: entity.deletedAt,
    });
  }
}
