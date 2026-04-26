import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Category } from '../src/categories/entities/category.entity';
import { Product } from '../src/products/entities/product.entity';
import { Order } from '../src/orders/entities/order.entity';
import { OrderItem } from '../src/orders/entities/order-item.entity';
import { Banner } from '../src/banners/entities/banner.entity';
import { UserRole } from '../src/common/constants/user-role.enum';
import { Repository } from 'typeorm';

describe('Admin Dashboard (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let adminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    process.env.DB_TYPE = 'sqlite';
    process.env.DB_DATABASE = ':memory:';
    process.env.DB_SYNCHRONIZE = 'true';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get('UserRepository');

    // Tạo Admin user
    const admin = await userRepository.save({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: UserRole.ADMIN,
    });

    // Login lấy token
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpassword' });
    adminToken = adminLogin.body.accessToken;

    // Tạo Customer user
    await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Customer', email: 'customer@example.com', password: 'password' });
    const customerLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'customer@example.com', password: 'password' });
    customerToken = customerLogin.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Category Management', () => {
    let categoryId: number;

    it('nên tạo danh mục mới (Admin only)', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ category_name: 'Sô cô la' })
        .expect(201)
        .then((res) => {
          expect(res.body.category_name).toBe('Sô cô la');
          categoryId = res.body.id;
        });
    });

    it('nên báo lỗi khi Customer tạo danh mục', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ category_name: 'Kẹo dẻo' })
        .expect(403);
    });

    it('nên lấy danh sách danh mục', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Product Management', () => {
    it('nên tạo sản phẩm mới (Admin only)', async () => {
      // Đầu tiên tạo một category cho product
      const catRes = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ category_name: 'Test Cat' });
      const catId = catRes.body.id;

      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          product_name: 'Kẹo mút',
          price: 5000,
          description: 'Ngon tuyệt',
          category: { id: catId }
        })
        .expect(201)
        .then((res) => {
          expect(res.body.product_name).toBe('Kẹo mút');
        });
    });

    it('nên báo lỗi khi Customer tạo sản phẩm', () => {
        return request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${customerToken}`)
          .send({ product_name: 'Kẹo mút', price: 5000 })
          .expect(403);
      });
  });
});
