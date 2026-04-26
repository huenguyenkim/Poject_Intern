import apiClient from './apiClient';

export const getOrders = async () => {
  const { data } = await apiClient.get('/orders');
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await apiClient.post('/orders', orderData);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await apiClient.put(`/orders/${id}/status`, { status });
  return data;
};
