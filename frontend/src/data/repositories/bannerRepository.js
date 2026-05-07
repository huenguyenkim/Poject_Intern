import apiClient from '../../api/apiClient';

/**
 * Banner Repository
 * 
 * Maps backend field names to frontend Domain properties.
 * Returns PLAIN OBJECTS for Redux Toolkit compatibility.
 */
export class BannerRepository {
  async getBanners(activeOnly = false) {
    const { data } = await apiClient.get('/banners', { params: { activeOnly } });
    return data.map(item => this._mapToDomain(item));
  }

  async createBanner(bannerData) {
    const payload = this._mapToPayload(bannerData);
    const { data } = await apiClient.post('/banners', payload);
    return this._mapToDomain(data);
  }

  async updateBanner(id, bannerData) {
    const payload = this._mapToPayload(bannerData);
    const { data } = await apiClient.put(`/banners/${id}`, payload);
    return this._mapToDomain(data);
  }

  async deleteBanner(id) {
    await apiClient.delete(`/banners/${id}`);
    return true;
  }

  // Analytics
  async trackImpression(id) {
    return apiClient.post(`/banners/${id}/impression`);
  }

  async trackClick(id) {
    return apiClient.post(`/banners/${id}/click`);
  }

  _mapToDomain(item) {
    return {
      id: item.id,
      title: item.title,
      imagePc: item.imagePcUrl || item.imageUrl || item.image,
      imageMobile: item.imageMobileUrl || item.imagePcUrl || item.imageUrl || item.image,
      link: item.linkUrl || item.link,
      startDate: item.startDate,
      endDate: item.endDate,
      position: item.position || 'home',
      priority: item.priority || 0,
      isActive: item.isActive,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      ctr: item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0
    };
  }

  _mapToPayload(data) {
    return {
      title: data.title,
      imagePcUrl: data.imagePc || data.image, // Fallback for old code
      imageMobileUrl: data.imageMobile,
      linkUrl: data.link,
      startDate: data.startDate,
      endDate: data.endDate,
      position: data.position,
      priority: data.priority,
      isActive: data.isActive
    };
  }
}

export const bannerRepository = new BannerRepository();
