import { orderRepository } from '../../../data/repositories/orderRepository';

/**
 * Get Orders Use Case
 */
export class GetOrders {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page = 1, limit = 10, filters = {}) {
    return this.repository.getOrders(page, limit, filters);
  }
}

/**
 * Get Order Metrics Use Case
 */
export class GetOrderMetrics {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    return this.repository.getOrderMetrics();
  }
}

/**
 * Create Order Use Case
 */
export class CreateOrder {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(orderData) {
    return this.repository.createOrder(orderData);
  }
}

/**
 * Update Order Status Use Case
 */
export class UpdateOrderStatus {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, status) {
    return this.repository.updateOrderStatus(id, status);
  }
}

/**
 * Get My Orders Use Case
 */
export class GetMyOrders {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page = 1, limit = 10) {
    return this.repository.getMyOrders(page, limit);
  }
}

/**
 * Get Order By Id Use Case
 */
export class GetOrderById {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.getOrderById(id);
  }
}

export const getOrdersUseCase = new GetOrders(orderRepository);
export const getOrderMetricsUseCase = new GetOrderMetrics(orderRepository);
export const getMyOrdersUseCase = new GetMyOrders(orderRepository);
export const createOrderUseCase = new CreateOrder(orderRepository);
export const updateOrderStatusUseCase = new UpdateOrderStatus(orderRepository);
export const getOrderByIdUseCase = new GetOrderById(orderRepository);
