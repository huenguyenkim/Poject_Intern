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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount: number;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: 0 })
  reservedCount: number; // For locking mechanism

  @Column({ nullable: true })
  maxUsage: number;

  @Column({ default: 1 })
  limitPerUser: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  allowStacking: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
