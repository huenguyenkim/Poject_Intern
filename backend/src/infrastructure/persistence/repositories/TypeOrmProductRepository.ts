import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../../core/domain/repositories/IProductRepository';
import { Product as DomainProduct } from '../../../core/domain/entities/Product';
import { Product as ProductEntity } from '../../../products/entities/product.entity';

/**
 * TypeORM Implementation of IProductRepository
 * 
 * Maps database-specific TypeORM entities to pure domain Product objects.
 */
@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<DomainProduct[]> {
    const products = await this.repository.find({ relations: ['category'] });
    return products.map(item => this.mapToDomain(item));
  }

  async findById(id: number): Promise<DomainProduct | null> {
    const item = await this.repository.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
    return item ? this.mapToDomain(item) : null;
  }

  async create(product: Partial<DomainProduct>): Promise<DomainProduct> {
    const entity = this.repository.create({
      productName: product.productName,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: { id: product.categoryId } as any,
      stock: product.stock,
    });
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async update(id: number, product: Partial<DomainProduct>): Promise<DomainProduct> {
    await this.repository.update(id, {
      productName: product.productName,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: { id: product.categoryId } as any,
      stock: product.stock,
    });
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: ProductEntity): DomainProduct {
    return DomainProduct.create({
      id: entity.id,
      productName: entity.productName,
      price: Number(entity.price),
      description: entity.description,
      imageUrl: entity.imageUrl,
      categoryId: entity.category?.id,
      categoryName: entity.category?.categoryName,
      stock: entity.stock,
    });
  }
}
