import apiClient from '../../api/apiClient';

/**
 * Order Repository
 * 
 * Maps backend field names to frontend properties.
 * Returns PLAIN OBJECTS for Redux Toolkit compatibility.
 */
export class OrderRepository {
  async getOrders(page = 1, limit = 10) {
    const { data } = await apiClient.get('/orders', { params: { page, limit } });
    return {
      data: data.data.map(item => this._mapOrder(item)),
      meta: data.meta
    };
  }

  async getMyOrders(page = 1, limit = 10) {
    const { data } = await apiClient.get('/orders/my', { params: { page, limit } });
    return {
      data: data.data.map(item => this._mapOrder(item)),
      meta: data.meta
    };
  }

  async getOrderById(id) {
    const { data } = await apiClient.get(`/orders/${id}`);
    return this._mapOrder(data);
  }

  async createOrder(orderData) {
    const { data } = await apiClient.post('/orders', orderData);
    return this._mapOrder(data);
  }

  async updateOrderStatus(id, status) {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return this._mapOrder(data);
  }

  _mapOrder(item) {
    return {
      id: item.id,
      userId: item.user?.id || item.userId,
      userName: item.user?.name || item.receiverName,
      email: item.user?.email,
      items: (item.orderItems || item.items || []).map(oi => ({
        id: oi.id,
        productId: oi.product?.id || oi.productId,
        title: oi.product?.productName || oi.title,
        image: oi.product?.imageUrl || oi.image,
        price: parseFloat(oi.unitPrice || oi.price),
        quantity: oi.quantity
      })),
      totalAmount: parseFloat(item.totalAmount),
      status: item.status,
      address: item.address,
      receiverName: item.receiverName,
      phone: item.phone,
      paymentMethod: item.paymentMethod,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }
}

export const orderRepository = new OrderRepository();
