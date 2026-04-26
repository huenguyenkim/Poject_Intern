/**
 * Product Entity
 * 
 * Represents a product in the Candy E-Commerce system.
 * This is a pure domain entity, independent of any UI or Data frameworks.
 */
export class Product {
  constructor({ id, title, price, description, categoryId, category, image, stock, status }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.categoryId = categoryId;
    this.category = category || 'Uncategorized';
    this.image = image;
    this.stock = stock || 0;
    this.status = status || 'ACTIVE';
  }

  // Domain logic example
  isInStock() {
    return this.stock > 0;
  }

  // Factory methods for creating from JSON or other sources
  static create(data) {
    return new Product(data);
  }
}
