import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ default: 'fixed' }) // 'fixed' or 'percent'
  discountType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderValue: number;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ nullable: true })
  maxUsage: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  allowStacking: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
