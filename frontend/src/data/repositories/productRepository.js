import apiClient from '../../api/apiClient';

/**
 * Product Repository Implementation
 * 
 * Maps backend field names (e.g., productName) to frontend Domain properties.
 * returns PLAIN OBJECTS to ensure Redux Toolkit compatibility.
 */
export class ProductRepository {
  async getProducts() {
    const { data } = await apiClient.get('/products');
    return data.map(item => ({
      id: item.id,
      title: item.productName || item.title,
      price: parseFloat(item.price),
      description: item.description,
      categoryId: item.categoryId,
      category: item.categoryName,
      image: item.imageUrl || item.image,
      stock: item.stock || 0,
      status: item.isActive ? 'ACTIVE' : 'DRAFT'
    }));
  }

  async getProductById(id) {
    const { data } = await apiClient.get(`/products/${id}`);
    return {
      id: data.id,
      title: data.productName,
      price: parseFloat(data.price),
      description: data.description,
      categoryId: data.categoryId,
      category: data.categoryName,
      image: data.imageUrl,
      stock: data.stock,
      status: data.isActive ? 'ACTIVE' : 'DRAFT'
    };
  }

  async createProduct(productData) {
    const payload = {
      productName: productData.title,
      price: productData.price,
      description: productData.description,
      categoryId: productData.categoryId,
      imageUrl: productData.image,
      stock: productData.stock || 0
    };
    const { data } = await apiClient.post('/products', payload);
    return {
      id: data.id,
      title: data.productName,
      price: parseFloat(data.price),
      description: data.description,
      categoryId: data.categoryId,
      image: data.imageUrl,
      stock: data.stock,
      status: 'ACTIVE'
    };
  }

  async updateProduct(id, productData) {
    const payload = {
      productName: productData.title,
      price: productData.price,
      description: productData.description,
      categoryId: productData.categoryId,
      imageUrl: productData.image,
      stock: productData.stock
    };
    const { data } = await apiClient.put(`/products/${id}`, payload);
    return {
      id: data.id,
      title: data.productName,
      price: parseFloat(data.price),
      description: data.description,
      categoryId: data.categoryId,
      image: data.imageUrl,
      stock: data.stock,
      status: 'ACTIVE'
    };
  }

  async deleteProduct(id) {
    await apiClient.delete(`/products/${id}`);
    return true;
  }
}

export const productRepository = new ProductRepository();
