import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll() {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(data: any) {
    const product = this.productRepository.create(data);
    const saved = await this.productRepository.save(product) as unknown as Product;
    
    if (saved.categoryId) {
      await this.categoriesService.incrementProductCount(saved.categoryId);
    }
    
    return saved;
  }

  async update(id: number, data: any) {
    const oldProduct = await this.findOne(id);
    const oldCategoryId = oldProduct.categoryId;
    
    await this.productRepository.update(id, data);
    const updated = await this.findOne(id);
    
    if (data.categoryId !== undefined && data.categoryId !== oldCategoryId) {
      if (oldCategoryId) {
        await this.categoriesService.decrementProductCount(oldCategoryId);
      }
      if (updated.categoryId) {
        await this.categoriesService.incrementProductCount(updated.categoryId);
      }
    }
    
    return updated;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const categoryId = product.categoryId;
    const result = await this.productRepository.remove(product);
    
    if (categoryId) {
      await this.categoriesService.decrementProductCount(categoryId);
    }
    
    return result;
  }

  /**
   * AI Recommendation: Market Basket Analysis
   * Tìm các sản phẩm thường được mua cùng sản phẩm hiện tại
   */
  async getRecommendations(id: number, limit: number = 4) {
    // 1. Tìm tất cả các orderId có chứa sản phẩm này
    const orderIdsResult = await this.productRepository.manager
      .createQueryBuilder('order_items', 'oi')
      .select('DISTINCT oi.orderId', 'orderId')
      .where('oi.productId = :id', { id })
      .getRawMany();

    const orderIds = orderIdsResult.map(r => r.orderId);

    if (orderIds.length === 0) {
      // Nếu chưa có ai mua cùng, gợi ý sản phẩm cùng chuyên mục
      const currentProduct = await this.findOne(id);
      return this.productRepository.find({
        where: { category: { id: currentProduct.category?.id } },
        relations: ['category'],
        take: limit,
      });
    }

    // 2. Tìm các sản phẩm khác trong những đơn hàng đó và đếm tần suất
    const recommendations = await this.productRepository.manager
      .createQueryBuilder('order_items', 'oi')
      .select('oi.productId', 'productId')
      .addSelect('COUNT(oi.productId)', 'count')
      .where('oi.orderId IN (:...orderIds)', { orderIds })
      .andWhere('oi.productId != :id', { id })
      .groupBy('oi.productId')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    if (recommendations.length === 0) {
        return [];
    }

    const recommendedIds = recommendations.map(r => r.productId);
    
    // 3. Lấy thông tin chi tiết các sản phẩm gợi ý
    return this.productRepository.findByIds(recommendedIds);
  }
}
