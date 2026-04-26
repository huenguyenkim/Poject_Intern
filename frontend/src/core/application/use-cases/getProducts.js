/**
 * Get Products Use Case
 * 
 * Logic to fetch and possibly filter products.
 * Acts as the entry point from UI adapters (Context/Hooks) to the Domain.
 */
export class GetProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute() {
    // We can add validation, caching logic, or filtering here
    const products = await this.productRepository.getProducts();
    
    // Example business rule: Only show active products in the main catalog
    // For now, returning all as the repository already handles basics
    return products;
  }
}

// Factor out instantiation for easier dependency injection
import { productRepository } from '../../../data/repositories/productRepository';
export const getProductsUseCase = new GetProducts(productRepository);
