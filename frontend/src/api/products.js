import apiClient from './apiClient';

export const getProducts = async () => {
  const { data } = await apiClient.get('/products');
  return data;
};

export const getProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await apiClient.post('/products', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await apiClient.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
};
