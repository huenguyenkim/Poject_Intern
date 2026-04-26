/**
 * Order Entity
 * 
 * Represents a customer order in the Candy E-Commerce system.
 */
export class Order {
  constructor({ id, userName, email, phone, address, items, subtotal, shippingFee, total, status, createdAt, paymentMethod }) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.items = items || [];
    this.subtotal = subtotal || 0;
    this.shippingFee = shippingFee || 0;
    this.total = total || 0;
    this.status = status || 'PENDING';
    this.createdAt = createdAt || new Date().toISOString();
    this.paymentMethod = paymentMethod || 'COD';
  }

  static create(data) {
    return new Order(data);
  }
}
