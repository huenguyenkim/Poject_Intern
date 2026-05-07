import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index, Check } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('products')
@Check(`"price" >= 0`)
@Check(`"stock" >= 0`)
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'product_name' })
  productName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ default: 0 })
  stock: number;

  @Column('decimal', { name: 'sale_price', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
