import apiClient from '../../api/apiClient';

/**
 * Category Repository
 * 
 * Maps backend field names (e.g., categoryName) to frontend Domain properties.
 * Returns PLAIN OBJECTS for Redux Toolkit compatibility.
 */
export class CategoryRepository {
  async getCategories(asTree = false) {
    const { data } = await apiClient.get('/categories', { params: { tree: asTree } });
    
    const mapper = (item) => ({
      id: item.id,
      name: item.categoryName || item.name,
      slug: item.slug,
      description: item.description,
      image: item.image || item.imageUrl,
      sortOrder: item.sortOrder || 0,
      productsCount: item.productsCount || 0,
      parentId: item.parentId,
      children: item.children ? item.children.map(mapper) : []
    });

    return data.map(mapper);
  }

  async createCategory(categoryData) {
    const payload = {
      categoryName: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      image: categoryData.image || '',
      sortOrder: categoryData.sortOrder || 0,
      parentId: categoryData.parentId || null
    };
    const { data } = await apiClient.post('/categories', payload);
    return {
      id: data.id,
      name: data.categoryName,
      slug: data.slug,
      description: data.description,
      image: data.image,
      sortOrder: data.sortOrder,
      parentId: data.parentId,
      productsCount: 0
    };
  }

  async updateCategory(id, categoryData) {
    const payload = {
      categoryName: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      image: categoryData.image,
      sortOrder: categoryData.sortOrder,
      parentId: categoryData.parentId
    };
    const { data } = await apiClient.put(`/categories/${id}`, payload);
    return {
      id: data.id,
      name: data.categoryName,
      slug: data.slug,
      description: data.description,
      image: data.image,
      sortOrder: data.sortOrder,
      parentId: data.parentId,
      productsCount: data.productsCount
    };
  }

  async deleteCategory(id, force = false) {
    await apiClient.delete(`/categories/${id}`, { params: { force } });
    return true;
  }
}

export const categoryRepository = new CategoryRepository();
