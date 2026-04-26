import apiClient from './apiClient';

export const getBanners = async () => {
  const { data } = await apiClient.get('/banners');
  return data;
};

export const createBanner = async (bannerData) => {
  const { data } = await apiClient.post('/banners', bannerData);
  return data;
};

export const updateBanner = async (id, bannerData) => {
  const { data } = await apiClient.put(`/banners/${id}`, bannerData);
  return data;
};

export const deleteBanner = async (id) => {
  const { data } = await apiClient.delete(`/banners/${id}`);
  return data;
};
