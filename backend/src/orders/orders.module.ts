import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    // Mặc dù ta dùng DataSource nhưng việc import TypeOrmModule.forFeature 
    // giúp đăng ký entities cho module tốt hơn.
    TypeOrmModule.forFeature([Order, OrderItem, Product, User]),
    CommonModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
