/**
 * Category Entity
 * 
 * Represents a product category in the Candy E-Commerce system.
 */
export class Category {
  constructor({ id, name, description, image, productCount }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.productCount = productCount || 0;
  }

  static create(data) {
    return new Category(data);
  }
}
