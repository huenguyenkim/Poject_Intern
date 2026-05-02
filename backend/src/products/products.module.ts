import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from '../categories/categories.module';
import { 
  GetProductsUseCase, 
  GetProductByIdUseCase, 
  CreateProductUseCase, 
  UpdateProductUseCase, 
  DeleteProductUseCase 
} from '../core/application/usecases/ProductUseCases';
import { IProductRepository } from '../core/domain/repositories/IProductRepository';
import { TypeOrmProductRepository } from '../infrastructure/persistence/repositories/TypeOrmProductRepository';

import { AuditModule } from '../audit/audit.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CategoriesModule),
    AuditModule,
    InventoryModule,
    CommonModule,
  ],
  providers: [
    GetProductsUseCase,
    GetProductByIdUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: IProductRepository,
      useClass: TypeOrmProductRepository,
    },
    ProductsService,
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
