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
  resetPasswordTokenHash: string | null;

  @Column({ nullable: true })
  resetPasswordExpiresAt: Date | null;

  @Column({ default: 1 })
  tokenVersion: number;

  @Column({ nullable: true })
  lastPasswordChangeAt: Date | null;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
