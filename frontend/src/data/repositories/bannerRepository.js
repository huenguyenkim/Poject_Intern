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
      link: item.linkUrl,
      endDate: item.endDate,
      tag: item.tag || 'ACTIVE',
      isActive: item.isActive
    }));
  }

  async createBanner(bannerData) {
    const payload = {
      title: bannerData.title,
      imageUrl: bannerData.image,
      linkUrl: bannerData.link,
      endDate: bannerData.endDate,
      isActive: bannerData.tag === 'ACTIVE'
    };
    const { data } = await apiClient.post('/banners', payload);
    return {
      id: data.id,
      title: data.title,
      image: data.imageUrl,
      link: data.linkUrl,
      endDate: data.endDate,
      tag: data.isActive ? 'ACTIVE' : 'DRAFT',
      isActive: data.isActive
    };
  }

  async updateBanner(id, bannerData) {
    const payload = {
      title: bannerData.title,
      imageUrl: bannerData.image,
      linkUrl: bannerData.link,
      endDate: bannerData.endDate,
      isActive: bannerData.tag === 'ACTIVE'
    };

    // Filter undefined fields to avoid overwriting with null
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { data } = await apiClient.put(`/banners/${id}`, payload);
    return {
      id: data.id,
      title: data.title,
      image: data.imageUrl,
      link: data.linkUrl,
      endDate: data.endDate,
      tag: data.isActive ? 'ACTIVE' : 'DRAFT',
      isActive: data.isActive
    };
  }

  async deleteBanner(id) {
    await apiClient.delete(`/banners/${id}`);
    return true;
  }
}

export const bannerRepository = new BannerRepository();
