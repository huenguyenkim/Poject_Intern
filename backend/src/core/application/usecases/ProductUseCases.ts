import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product as DomainProduct } from '../../domain/entities/Product';
import { AuditService } from '../../../audit/audit.service';
import { CacheHelperService } from '../../../common/cache-helper.service';
import { Product as EntityProduct } from '../../../products/entities/product.entity';

/**
 * Get All Products Use Case
 */
@Injectable()
export class GetProductsUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(): Promise<DomainProduct[]> {
    return this.repository.findAll();
  }
}

/**
 * Get Product By ID Use Case
 */
@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: number): Promise<DomainProduct> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}

/**
 * Create Product Use Case
 */
@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async execute(data: Partial<DomainProduct>): Promise<DomainProduct> {
    const product = await this.repository.create(data);
    await this.cacheHelper.invalidatePattern('/products');
    return product;
  }
}

/**
 * Update Product Use Case
 */
@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async execute(
    id: number, 
    data: Partial<DomainProduct>, 
    metadata: { userId?: number; ip?: string; ua?: string } = {}
  ): Promise<DomainProduct> {
    // 1. Fetch current state OUTSIDE transaction (Late Locking)
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // 2. Selective Comparison (Sensitive Fields Only: Price, Stock)
    const sensitiveFields = ['price', 'stock'];
    const changes: { field: string; oldVal: any; newVal: any }[] = [];

    sensitiveFields.forEach(field => {
      if (data[field] !== undefined && this.auditService.hasChanged(existing[field], data[field])) {
        changes.push({ field, oldVal: existing[field], newVal: data[field] });
      }
    });

    // 3. START ATOMIC TRANSACTION (Only right before save)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update the entity
      const updatedProduct = await this.repository.update(id, data);

      // Record Audit Logs for sensitive changes
      for (const change of changes) {
        await this.auditService.record(queryRunner.manager, {
          tableName: 'products',
          recordId: id,
          actionType: 'UPDATE',
          fieldName: change.field,
          oldValue: change.oldVal,
          newValue: change.newVal,
          userId: metadata.userId || 0,
          ipAddress: metadata.ip,
          userAgent: metadata.ua,
          isSensitive: true, // Attach IP/UA metadata as requested
        });
      }

      await queryRunner.commitTransaction();

      // 4. SELECTIVE CACHE INVALIDATION (Post-transaction)
      await this.cacheHelper.invalidatePattern('/products');
      
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

/**
 * Delete Product Use Case
 */
@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly repository: IProductRepository,
    private readonly auditService: AuditService,
    private readonly cacheHelper: CacheHelperService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    id: number, 
    metadata: { userId?: number; ip?: string; ua?: string } = {}
  ): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.repository.delete(id);

      await this.auditService.record(queryRunner.manager, {
        tableName: 'products',
        recordId: id,
        actionType: 'DELETE',
        userId: metadata.userId || 0,
        ipAddress: metadata.ip,
        userAgent: metadata.ua,
        isSensitive: true,
      });

      await queryRunner.commitTransaction();
      await this.cacheHelper.invalidatePattern('/products');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
