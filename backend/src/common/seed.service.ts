import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { BannersService } from '../banners/banners.service';
import { CacheHelperService } from './cache-helper.service';

import { IUserRepository } from '../core/domain/repositories/IUserRepository';
import { IHashingService } from '../core/application/usecases/AuthUseCases';
import { UserRole } from './constants/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderStatus } from './constants/order-status.enum';
import { Coupon } from '../orders/entities/coupon.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly bannersService: BannersService,
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly cacheHelper: CacheHelperService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    console.log('🌱 Seeding database...');

    // Seed Admin User
    const adminEmail = 'nguyenhue2612200398@gmail.com';
    const existingAdmin = await this.userRepository.findByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await this.hashingService.hash('admin123');
      await this.userRepository.create({
        fullName: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      console.log('👑 Admin user created!');
    }

    // Seed Test Customers
    const testUsers = [
      { fullName: 'Liam Sweet', email: 'sweet@example.com', password: 'password123' },
      { fullName: 'Emma Sugar', email: 'sugar@example.com', password: 'password123' },
      { fullName: 'Test User', email: 'testuser@example.com', password: 'test1234' },
      { fullName: 'Def User', email: 'def@example.com', password: '@User22222' },
    ];

    for (const u of testUsers) {
      try {
        const existing = await this.userRepository.findByEmail(u.email);
        const hashedPassword = await this.hashingService.hash(u.password);
        if (!existing) {
          await this.userRepository.create({
            fullName: u.fullName,
            email: u.email,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
          });
          console.log(`👤 Customer created: ${u.fullName}`);
        } else {
          // Update existing test user to ensure password matches seed
          await this.userRepository.update(existing.id, { password: hashedPassword });
          console.log(`👤 Customer updated: ${u.fullName}`);
        }
      } catch (e) {
        console.warn(`⚠️ Could not seed user ${u.email}: ${e.message}`);
      }
    }

    // Force remove 'The Glaze Galaxy' and 'Rainbow Stack Donuts' if they exist
    const allProductsInitial = await this.productsService.findAll();
    const toDelete = ['The Glaze Galaxy', 'Rainbow Stack Donuts'];
    for (const name of toDelete) {
      try {
        const target = allProductsInitial.find(p => p.productName === name);
        if (target) {
          await this.productsService.remove(target.id);
          console.log(`🗑️ Product removed: ${name}`);
        }
      } catch (e) {
        console.warn(`⚠️ Could not remove product ${name}: ${e.message}`);
      }
    }

    // Clear cache to ensure UI updates
    await this.cacheHelper.clear();
    console.log('🧹 Cache cleared during seeding');

    // Seed Historical Orders for Analytics
    const products = await this.productsService.findAll();
    if (products.length > 0) {
        console.log('📦 Seeding historical orders for analytics...');
        for (let i = 1; i <= 20; i++) {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - (i * 2)); // Orders every 2 days
          
          const order = this.orderRepository.create({
            receiverName: 'Liam Sweet',
            phone: '0123456789',
            address: '123 Candy Lane',
            totalAmount: 50 + Math.random() * 100,
            status: OrderStatus.DELIVERED,
            createdAt: pastDate,
          });
          const savedOrder = await this.orderRepository.save(order);
          
          // Add random items
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const item = this.orderItemRepository.create({
            order: savedOrder as any,
            product: randomProduct,
            quantity: 1 + Math.floor(Math.random() * 3),
            unitPrice: randomProduct.price,
          });
          await this.orderItemRepository.save(item);
        }
        console.log('✅ Historical orders seeded!');
      }

    // Check if categories exist
    const categories = await this.categoriesService.findAll();
    const productsCount = await this.productsService.findAll();
    
    if (categories.length > 0 && productsCount.length > 0) {
      // FORCE UPDATE: Đảm bảo các sản phẩm cũ có stock để test (Vì logic seed cũ không có stock)
      for (const p of productsCount) {
        if (!p.stock || p.stock === 0) {
           await this.productsService.update(p.id, { stock: 100 });
        }
      }
      console.log('✅ Catalog verification complete (Updated Stock)!');
    }

    let createdCategories = categories;
    if (categories.length === 0) {
      const categoryData = [
        { categoryName: 'Gummies', image: '/images/cat-gummies.png', description: 'Vibrant, chewy treats with a burst of fruity joy.' },
        { categoryName: 'Chocolate', image: '/images/cat-chocolate.png', description: 'Luxurious truffles and bars for the sophisticated palate.' },
        { categoryName: 'Hard Candy', image: '/images/cat-hard-candy.png', description: 'Sparkling, jewel-toned sweets with long-lasting flavor.' },
        { categoryName: 'Baked Goods', image: '/images/cat-baked-goods.png', description: 'Assorted pastries and cookies, baked to sweet perfection.' },
        { categoryName: 'Sour Bites', image: '/images/cat-sour-bites.png', description: 'Neon-colored ribbons with a signature zesty coating.' }
      ];
      createdCategories = [];
      for (const data of categoryData) {
        const cat = await this.categoriesService.create(data) as any;
        createdCategories.push(cat);
      }
    }

    const initialProducts = [
      { productName: 'Pastel Macaron Box', price: 24.00, description: 'Assorted box of 12 delicate French macarons.', imageUrl: '/images/macaron-featured.png', categoryId: createdCategories.find(c => c.categoryName === 'Baked Goods')?.id, stock: 100 },
      { productName: 'Golden Truffle Set', price: 32.50, description: 'Decadent chocolate truffles wrapped in edible 24k gold leaf.', imageUrl: '/images/chocolate_cat.png', categoryId: createdCategories.find(c => c.categoryName === 'Chocolate')?.id, stock: 100 },
      { productName: 'Cotton Cloud Swirls', price: 8.99, description: 'Light as air cotton candy bites.', imageUrl: '/images/cotton-cloud.png', categoryId: createdCategories.find(c => c.categoryName === 'Hard Candy')?.id, stock: 100 },
      { productName: 'Magic Jelly Beans', price: 19.00, description: 'A mystical assortment of beans with galaxy-inspired flavors!', imageUrl: '/images/jellybeans-featured.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Neon Rainbow Gummies', price: 12.99, description: 'A burst of citrus and berry flavors that pop!', imageUrl: '/images/neon-rainbow-gummies.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Zesty Sour Belts', price: 10.99, description: 'Extra sour, extra tangy chewy belts in a classic glass jar.', imageUrl: '/images/sour-belts-jar.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Neon Sour Strips', price: 9.50, description: 'Zesty fruit-flavored ribbons with a signature sour crystalline coating.', imageUrl: '/images/sour-strips.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Salted Caramel Silk', price: 12.99, description: 'Velvety milk chocolate filled with house-made fleur de sel caramel.', imageUrl: '/images/salted-caramel.png', categoryId: createdCategories.find(c => c.categoryName === 'Chocolate')?.id, stock: 100 },
    ];

    for (const p of initialProducts) {
      await this.productsService.create(p);
    }

    // Seed Premium Banners
    const bannerData = [
      { 
        title: 'Spring Delights', 
        imagePcUrl: '/images/macaron-featured.png', 
        isActive: true,
        priority: 10,
        position: 'home' as any
      },
      { 
        title: 'Dark Desire Collection', 
        imagePcUrl: '/images/chocolate_cat.png', 
        isActive: true,
        priority: 5,
        position: 'home' as any
      }
    ];

    const existingBanners = await this.bannersService.findAll();
    if (existingBanners.length === 0) {
      for (const b of bannerData) {
        await this.bannersService.create(b);
      }
      console.log('🖼️ Banners seeded!');
    }
    
    // Seed Test Coupons
    const testCoupon = {
      code: 'CANDYLOVE2024',
      discountType: 'percent',
      discountValue: 20,
      isActive: true,
      minOrderValue: 10,
      maxUsage: 100,
      usageCount: 0
    };
    
    const existingCoupon = await this.couponRepository.findOne({ where: { code: testCoupon.code } });
    if (!existingCoupon) {
      await this.couponRepository.save(this.couponRepository.create(testCoupon));
      console.log('🎫 Coupon seeded: CANDYLOVE2024');
    }


    console.log('✅ Seeding complete!');
  }
}
