import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVisit } from './entities/page-visit.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '../users/entities/user.entity'; // <-- Thêm dòng này

@Module({
  // Thêm User vào danh sách forFeature
  imports: [TypeOrmModule.forFeature([PageVisit, Order, OrderItem, User])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule { }