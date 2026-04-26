import { Product } from '../entities/Product';

/**
 * Product Repository Interface
 * 
 * Defines the contract for product data access.
 * The implementation (Infrastructure) must adhere to this.
 * Note: We use an abstract class to support NestJS DI tokens.
 */
export abstract class IProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: number): Promise<Product | null>;
  abstract create(product: Partial<Product>): Promise<Product>;
  abstract update(id: number, product: Partial<Product>): Promise<Product>;
  abstract delete(id: number): Promise<void>;
}
