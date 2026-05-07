import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(asTree = false) {
    const categories = await this.categoryRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
      relations: ['parent']
    });

    if (asTree) {
      return this.buildTree(categories);
    }

    return categories;
  }

  private buildTree(categories: Category[], parentId: number | null = null): any[] {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat,
        children: this.buildTree(categories, cat.id)
      }));
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'children', 'parent'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { categoryName, slug, parentId, ...rest } = createCategoryDto;
    
    const finalSlug = slug || this.generateSlug(categoryName);
    
    // Check if slug exists
    const existing = await this.categoryRepository.findOne({ where: { slug: finalSlug } });
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    if (parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    const category = this.categoryRepository.create({
      ...rest,
      categoryName,
      slug: finalSlug,
      parentId: parentId || null
    } as any);

    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { categoryName, slug, parentId, ...rest } = updateCategoryDto;

    if (categoryName && !slug) {
      // Auto update slug if name changed but slug not provided
      // Optional: usually we don't change slug automatically to preserve SEO
    }

    if (parentId !== undefined) {
      if (parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }
      
      if (parentId) {
        const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
        if (!parent) throw new NotFoundException('Parent category not found');
        
        // Circular reference check
        const isChild = await this.isDescendantOf(parentId, id);
        if (isChild) {
          throw new BadRequestException('Circular reference detected: Parent cannot be a descendant');
        }
      }
    }

    Object.assign(category, {
      ...rest,
      categoryName: categoryName || category.categoryName,
      slug: slug || category.slug,
      parentId: parentId === undefined ? category.parentId : parentId
    } as any);

    return this.categoryRepository.save(category);
  }

  private async isDescendantOf(targetId: number, potentialAncestorId: number): Promise<boolean> {
    const target = await this.categoryRepository.findOne({ where: { id: targetId } });
    if (!target || !target.parentId) return false;
    if (target.parentId === potentialAncestorId) return true;
    return this.isDescendantOf(target.parentId, potentialAncestorId);
  }

  async remove(id: number, force = false) {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['products', 'children']
    });

    if (!category) throw new NotFoundException('Category not found');

    if (!force) {
      if (category.products && category.products.length > 0) {
        throw new BadRequestException('Cannot delete category containing products. Move products first.');
      }
      if (category.children && category.children.length > 0) {
        throw new BadRequestException('Cannot delete category with children. Delete or move children first.');
      }
    } else {
      // Manual unlinking to ensure success regardless of DB onDelete settings
      if (category.products && category.products.length > 0) {
        await this.productRepository.update(
          { categoryId: id },
          { categoryId: null as any }
        );
      }
      if (category.children && category.children.length > 0) {
        await this.categoryRepository.update(
          { parentId: id },
          { parentId: null as any }
        );
      }
    }

    return this.categoryRepository.remove(category);
  }

  async incrementProductCount(id: number) {
    await this.categoryRepository.increment({ id }, 'productsCount', 1);
  }

  async decrementProductCount(id: number) {
    await this.categoryRepository.decrement({ id }, 'productsCount', 1);
  }

  async getOverview() {
    const categories = await this.categoryRepository.find({
      relations: ['products'],
      order: { sortOrder: 'ASC', id: 'ASC' }
    });

    return categories.map(cat => ({
      ...cat,
      products: cat.products.slice(0, 4)
    }));
  }
}
