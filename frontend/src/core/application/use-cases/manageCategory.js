import { categoryRepository } from '../../../data/repositories/categoryRepository';

/**
 * Get Categories Use Case
 */
export class GetCategories {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    return this.repository.getCategories();
  }
}

/**
 * Create Category Use Case
 */
export class CreateCategory {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    return this.repository.createCategory(data);
  }
}

/**
 * Update Category Use Case
 */
export class UpdateCategory {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data) {
    return this.repository.updateCategory(id, data);
  }
}

/**
 * Delete Category Use Case
 */
export class DeleteCategory {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.deleteCategory(id);
  }
}

export const getCategoriesUseCase = new GetCategories(categoryRepository);
export const createCategoryUseCase = new CreateCategory(categoryRepository);
export const updateCategoryUseCase = new UpdateCategory(categoryRepository);
export const deleteCategoryUseCase = new DeleteCategory(categoryRepository);
