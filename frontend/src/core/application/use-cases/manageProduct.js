import { productRepository } from '../../../data/repositories/productRepository';

/**
 * Create Product Use Case
 */
export class CreateProduct {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    return this.repository.createProduct(data);
  }
}

/**
 * Update Product Use Case
 */
export class UpdateProduct {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data) {
    return this.repository.updateProduct(id, data);
  }
}

/**
 * Delete Product Use Case
 */
export class DeleteProduct {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.deleteProduct(id);
  }
}

export const createProductUseCase = new CreateProduct(productRepository);
export const updateProductUseCase = new UpdateProduct(productRepository);
export const deleteProductUseCase = new DeleteProduct(productRepository);
