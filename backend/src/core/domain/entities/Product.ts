/**
 * Product Domain Entity
 * 
 * Pure domain model for products in the backend.
 * Represents the core business state, free from framework or database decorators.
 */
export class Product {
  constructor(
    public readonly id: number,
    public readonly productName: string,
    public readonly price: number,
    public readonly description?: string,
    public readonly imageUrl?: string,
    public readonly categoryId?: number,
    public readonly categoryName?: string,
    public readonly stock: number = 0,
  ) {}

  /**
   * Domain rules can be added here as methods.
   */
  isValidPrice(): boolean {
    return this.price >= 0;
  }

  static create(data: {
    id: number;
    productName: string;
    price: number;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    categoryName?: string;
    stock?: number;
  }): Product {
    return new Product(
      data.id,
      data.productName,
      data.price,
      data.description,
      data.imageUrl,
      data.categoryId,
      data.categoryName,
      data.stock ?? 0,
    );
  }
}
