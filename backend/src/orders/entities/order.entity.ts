import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../../common/constants/order-status.enum';
import { PaymentMethod } from '../../common/constants/payment-method.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'receiver_name' })
  receiverName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ name: 'payment_method', type: 'simple-enum', enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Column('decimal', { precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Index()
  @Column({ type: 'simple-enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'coupon_code', nullable: true })
  couponCode: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'discount_amount', default: 0 })
  discountAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
