import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productId: number;

  @Column({ nullable: true })
  orderId: number;

  @Column()
  actionType: string; // DEDUCTION, REFUND, ADJUSTMENT

  @Column('int')
  quantityChange: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: 0 })
  userId: number; // 0 for SYSTEM

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
