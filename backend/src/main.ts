import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Tăng cường Bảo mật với Helmet (Security Headers)
  app.use(helmet());

  // 2. Cấu hình CORS Nghiêm ngặt
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Bật Nén Dữ liệu (Compression)
  app.use(compression());

  // 4. Bật Validation Toàn cầu (Strict Mode)
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,               // Loại bỏ các fields không có trong DTO
      forbidNonWhitelisted: true,    // Khôi phục bảo mật nghiêm ngặt
      transform: true,               // Tự động chuyển kiểu dữ liệu
    }));

  await app.listen(process.env.PORT ?? 3000);

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
