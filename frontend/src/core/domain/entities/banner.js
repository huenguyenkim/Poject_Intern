/**
 * Banner Entity
 * 
 * Represents a promotional banner on the storefront.
 */
export class Banner {
  constructor({ id, title, image, link, endDate, tag }) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.link = link;
    this.endDate = endDate;
    this.tag = tag || 'ACTIVE';
  }

  static create(data) {
    return new Banner(data);
  }
}
