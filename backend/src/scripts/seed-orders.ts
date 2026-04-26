import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { IUserRepository } from '../core/domain/repositories/IUserRepository';
import { OrderStatus } from '../common/constants/order-status.enum';
import { PaymentMethod } from '../common/constants/payment-method.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ordersService = app.get(OrdersService);
  const productsService = app.get(ProductsService);
  const userRepository = app.get(IUserRepository);

  console.log('🚀 Seeding test orders...');

  const user = await userRepository.findByEmail('sweet@example.com');
  const products = await productsService.findAll();

  if (!user || products.length === 0) {
    console.error('❌ Missing user or products. Run normal seed first.');
    await app.close();
    return;
  }

  const testOrders = [
    {
      userId: user.id,
      receiverName: 'Liam Sweet',
      phone: '0987654321',
      address: '123 Candy Lane, Sugar City',
      paymentMethod: PaymentMethod.COD,
      cartItems: [
        { productId: products[0].id, quantity: 2 },
        { productId: products[1].id, quantity: 1 }
      ]
    },
    {
      userId: user.id,
      receiverName: 'Emma Sugar',
      phone: '0123456789',
      address: '456 Marshmallow Ave, Fluff Town',
      paymentMethod: PaymentMethod.COD,
      cartItems: [
        { productId: products[2].id, quantity: 5 }
      ]
    }
  ];

  for (const o of testOrders as any) {
    const order = await ordersService.createOrder(o);
    console.log(`✅ Created Order #${order.id} for ${o.receiverName}`);
    
    // Randomly update status for some
    if (Math.random() > 0.5) {
      await ordersService.updateStatus(order.id, OrderStatus.CONFIRMED);
      console.log(`   - Status updated to CONFIRMED`);
    }
  }

  console.log('✨ Order seeding complete!');
  await app.close();
}

bootstrap();
