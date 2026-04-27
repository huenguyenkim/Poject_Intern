import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { BannersService } from '../banners/banners.service';

import { IUserRepository } from '../core/domain/repositories/IUserRepository';
import { IHashingService } from '../core/application/usecases/AuthUseCases';
import { UserRole } from './constants/user-role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly bannersService: BannersService,
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    console.log('🌱 Seeding database...');

    // Seed Admin User
    const adminEmail = 'admin@candy.com';
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
    ];

    for (const u of testUsers) {
      try {
        const existing = await this.userRepository.findByEmail(u.email);
        if (!existing) {
          const hashedPassword = await this.hashingService.hash(u.password);
          await this.userRepository.create({
            fullName: u.fullName,
            email: u.email,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
          });
          console.log(`👤 Customer created: ${u.fullName}`);
        }
      } catch (e) {
        console.warn(`⚠️ Could not seed user ${u.email}: ${e.message}`);
      }
    }

    // Check if categories exist
    const categories = await this.categoriesService.findAll();
    if (categories.length > 0) {
      // FORCE UPDATE: Đảm bảo các sản phẩm cũ có stock để test (Vì logic seed cũ không có stock)
      const allProds = await this.productsService.findAll();
      for (const p of allProds) {
        if (!p.stock || p.stock === 0) {
           await this.productsService.update(p.id, { stock: 100 });
        }
      }
      console.log('✅ Seeding complete (Skip existing categories, Updated Stock)!');
      return;
    }

    const categoryData = [
      { categoryName: 'Gummies', image: '/images/cat-gummies.png', description: 'Vibrant, chewy treats with a burst of fruity joy.' },
      { categoryName: 'Chocolate', image: '/images/cat-chocolate.png', description: 'Luxurious truffles and bars for the sophisticated palate.' },
      { categoryName: 'Hard Candy', image: '/images/cat-hard-candy.png', description: 'Sparkling, jewel-toned sweets with long-lasting flavor.' },
      { categoryName: 'Baked Goods', image: '/images/cat-baked-goods.png', description: 'Assorted pastries and cookies, baked to sweet perfection.' },
      { categoryName: 'Sour Bites', image: '/images/cat-sour-bites.png', description: 'Neon-colored ribbons with a signature zesty coating.' }
    ];
    const createdCategories: Category[] = [];

    for (const data of categoryData) {
      const cat = await this.categoriesService.create(data);
      createdCategories.push(cat);
    }

    const initialProducts = [
      { productName: 'Pastel Macaron Box', price: 24.00, description: 'Assorted box of 12 delicate French macarons.', imageUrl: '/images/macaron-featured.png', categoryId: createdCategories.find(c => c.categoryName === 'Baked Goods')?.id, stock: 100 },
      { productName: 'Golden Truffle Set', price: 32.50, description: 'Decadent chocolate truffles wrapped in edible 24k gold leaf.', imageUrl: '/images/chocolate_cat.png', categoryId: createdCategories.find(c => c.categoryName === 'Chocolate')?.id, stock: 100 },
      { productName: 'Cotton Cloud Swirls', price: 8.99, description: 'Light as air cotton candy bites.', imageUrl: '/images/cotton-cloud.png', categoryId: createdCategories.find(c => c.categoryName === 'Hard Candy')?.id, stock: 100 },
      { productName: 'Magic Jelly Beans', price: 19.00, description: 'A mystical assortment of beans with galaxy-inspired flavors!', imageUrl: '/images/jellybeans-featured.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Neon Rainbow Gummies', price: 12.99, description: 'A burst of citrus and berry flavors that pop!', imageUrl: '/images/neon-rainbow-gummies.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Zesty Sour Belts', price: 10.99, description: 'Extra sour, extra tangy chewy belts in a classic glass jar.', imageUrl: '/images/sour-belts-jar.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Rainbow Stack Donuts', price: 15.50, description: 'A towering stack of our finest glazed donuts with limited-edition sprinkles.', imageUrl: '/images/glaze-galaxy-donuts.png', categoryId: createdCategories.find(c => c.categoryName === 'Baked Goods')?.id, stock: 100 },
      { productName: 'Neon Sour Strips', price: 9.50, description: 'Zesty fruit-flavored ribbons with a signature sour crystalline coating.', imageUrl: '/images/sour-strips.png', categoryId: createdCategories.find(c => c.categoryName === 'Gummies')?.id, stock: 100 },
      { productName: 'Salted Caramel Silk', price: 12.99, description: 'Velvety milk chocolate filled with house-made fleur de sel caramel.', imageUrl: '/images/salted-caramel.png', categoryId: createdCategories.find(c => c.categoryName === 'Chocolate')?.id, stock: 100 },
      { productName: 'The Glaze Galaxy', price: 15.50, description: 'A cosmic assortment of our finest glazed donuts with limited-edition space sprinkles.', imageUrl: '/images/glaze-galaxy-donuts.png', categoryId: createdCategories.find(c => c.categoryName === 'Baked Goods')?.id, stock: 100 },
    ];

    for (const p of initialProducts) {
      await this.productsService.create(p);
    }

    // Seed Premium Banners
    const banners = [
      { 
        title: 'Spring Delights', 
        subtitle: 'Experience the magic of seasonal treats', 
        imageUrl: '/images/macaron-featured.png', 
        isActive: true 
      },
      { 
        title: 'Dark Desire Collection', 
        subtitle: 'Premium hand-crafted dark chocolates', 
        imageUrl: '/images/chocolate_cat.png', 
        isActive: true 
      }
    ];

    for (const b of banners) {
      await this.bannersService.create(b);
    }

    console.log('✅ Seeding complete!');
  }
}
