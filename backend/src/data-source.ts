import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Banner } from './banners/entities/banner.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { InventoryLog } from './inventory/entities/inventory-log.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'candy_ecommerce.db',
  entities: [User, Category, Product, Order, OrderItem, Banner, AuditLog, InventoryLog],
  synchronize: false,
  logging: true,
});
