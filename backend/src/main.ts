import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Tăng cường Bảo mật với Helmet (Security Headers)
  app.use(helmet());

  // 2. Tăng giới hạn payload để lưu ảnh Base64
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 2. Cấu hình CORS Nghiêm ngặt
  // 2. Cấu hình CORS Nghiêm ngặt
  // backend/src/main.ts

  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
  ];

  // Chuẩn hóa frontendUrl: loại bỏ khoảng trắng và dấu gạch chéo cuối cùng
  if (frontendUrl) {
    const sanitizedUrl = frontendUrl.trim().replace(/\/$/, "");
    allowedOrigins.push(sanitizedUrl);
  }

  app.enableCors({
    origin: (origin, callback) => {
      // 1. Nếu origin không có (vd: server-to-server) hoặc nằm trong whitelist -> Cho phép
      // 2. Kiểm tra origin sau khi đã loại bỏ dấu gạch chéo cuối (nếu có)
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Bắt buộc cho /auth/remember (gửi cookie/token)
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });
  // 3. Bật Nén Dữ liệu (Compression)
  app.use(compression());

  // 4. Bật Interceptor Toàn cầu (Sanitization)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 5. Bật Validation Toàn cầu (Strict Mode)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Loại bỏ các fields không có trong DTO
    forbidNonWhitelisted: true,    // Khôi phục bảo mật nghiêm ngặt
    transform: true,               // Tự động chuyển kiểu dữ liệu
  }));

  // 6. Set global prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  // --- NON-BLOCKING CACHE WARMING ---
  // We use a self-invoking async function to not block the main listen event
  (async () => {
    try {
      const axios = (await import('axios')).default;
      const baseUrl = `http://localhost:${process.env.PORT ?? 3000}`;
      await Promise.all([
        axios.get(`${baseUrl}/products`),
        axios.get(`${baseUrl}/categories`),
      ]);
      console.log('🚀 Cache warmed successfully');
    } catch (e) {
      console.error('⚠️ Cache warming failed (This is non-blocking):', e.message);
    }
  })();
}

bootstrap();
