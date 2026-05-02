import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Tăng cường Bảo mật với Helmet (Security Headers)
  app.use(helmet());

  // 2. Cấu hình CORS Nghiêm ngặt
  // 2. Cấu hình CORS Nghiêm ngặt
  const frontendUrl = process.env.FRONTEND_URL;

  // Danh sách các nguồn được phép mặc định (development)
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173'
  ];

  // Thêm domain thực tế vào danh sách nếu có biến môi trường
  if (frontendUrl) {
    allowedOrigins.push(frontendUrl.replace(/\/$/, "")); // Loại bỏ dấu gạch chéo cuối nếu có
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép các yêu cầu không có origin (như di động, curl) 
      // hoặc origin nằm trong danh sách trắng
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Quan trọng để gửi cookie/token
    allowedHeaders: 'Content-Type, Accept, Authorization',
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
