import apiClient from './apiClient';

export const getCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await apiClient.post('/categories', categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await apiClient.put(`/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await apiClient.delete(`/categories/${id}`);
  return data;
};
