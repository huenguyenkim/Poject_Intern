import apiClient from '../../api/apiClient';

/**
 * Category Repository
 * 
 * Maps backend field names (e.g., categoryName) to frontend Domain properties.
 * Returns PLAIN OBJECTS for Redux Toolkit compatibility.
 */
export class CategoryRepository {
  async getCategories() {
    const { data } = await apiClient.get('/categories');
    return data.map(item => ({
      id: item.id,
      name: item.categoryName || item.name,
      description: item.description,
      image: item.imageUrl || item.image,
      productCount: item.products?.length || 0
    }));
  }

  async createCategory(categoryData) {
    const payload = {
      categoryName: typeof categoryData === 'string' ? categoryData : categoryData.name,
      description: categoryData.description || '',
      imageUrl: categoryData.image || ''
    };
    const { data } = await apiClient.post('/categories', payload);
    return {
      id: data.id,
      name: data.categoryName,
      description: data.description,
      image: data.imageUrl
    };
  }

  async updateCategory(id, categoryData) {
    const payload = {
      categoryName: categoryData.name,
      description: categoryData.description,
      imageUrl: categoryData.image
    };
    const { data } = await apiClient.put(`/categories/${id}`, payload);
    return {
      id: data.id,
      name: data.categoryName,
      description: data.description,
      image: data.imageUrl
    };
  }

  async deleteCategory(id) {
    await apiClient.delete(`/categories/${id}`);
    return true;
  }
}

export const categoryRepository = new CategoryRepository();
