import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { UserRole } from '../../common/constants/user-role.enum';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ default: 'BASIC' }) // BASIC, PREMIUM, VIP
  tier: string;

  @Column({ default: 0 })
  loyaltyPoints: number;

  @Column({ type: 'text', nullable: true })
  resetPasswordTokenHash: string; // Đã bỏ | null

  @Column({ nullable: true }) // Đã bỏ type: 'datetime'
  resetPasswordExpiresAt: Date; // Đã bỏ | null

  @Column({ default: 0 })
  resetPasswordRetryCount: number;

  @Column({ default: 1 })
  tokenVersion: number;

  @Column({ nullable: true }) // Đã bỏ type: 'datetime'
  lastPasswordChangeAt: Date; // Đã bỏ | null

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}