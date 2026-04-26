import apiClient from '../../api/apiClient';

/**
 * Banner Repository
 * 
 * Maps backend field names to frontend Domain properties.
 * Returns PLAIN OBJECTS for Redux Toolkit compatibility.
 */
export class BannerRepository {
  async getBanners() {
    const { data } = await apiClient.get('/banners');
    return data.map(item => ({
      id: item.id,
      title: item.title,
      image: item.imageUrl || item.image,
      link: item.link,
      endDate: item.endDate,
      tag: item.tag || 'ACTIVE',
      isActive: item.isActive
    }));
  }

  async createBanner(bannerData) {
    const { data } = await apiClient.post('/banners', bannerData);
    return {
      id: data.id,
      title: data.title,
      image: data.imageUrl,
      link: data.link,
      endDate: data.endDate,
      tag: data.tag || 'ACTIVE',
      isActive: data.isActive
    };
  }

  async updateBanner(id, bannerData) {
    const { data } = await apiClient.put(`/banners/${id}`, bannerData);
    return {
      id: data.id,
      title: data.title,
      image: data.imageUrl,
      link: data.link,
      endDate: data.endDate,
      tag: data.tag || 'ACTIVE',
      isActive: data.isActive
    };
  }

  async deleteBanner(id) {
    await apiClient.delete(`/banners/${id}`);
    return true;
  }
}

export const bannerRepository = new BannerRepository();
