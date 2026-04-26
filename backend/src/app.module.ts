import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Banner } from './banners/entities/banner.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { InventoryLog } from './inventory/entities/inventory-log.entity';

// Modules
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { BannersModule } from './banners/banners.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { InventoryModule } from './inventory/inventory.module';
import { SeedService } from './common/seed.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'public'),
      serveRoot: '/',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 100,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 Phút
      limit: 100,  // Max 100 requests per IP per minute
    }]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'candy_ecommerce.db',
      entities: [User, Category, Product, Order, OrderItem, Banner, AuditLog, InventoryLog],
      synchronize: true, // Chỉ dùng trong môi trường phát triển
    }),
    OrdersModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    BannersModule,
    AuthModule,
    AuditModule,
    InventoryModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
