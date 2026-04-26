import { DataSource } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { OrderStatus } from '../common/constants/order-status.enum';

async function seedManyOrders() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'candy_ecommerce.db',
    entities: [Order, OrderItem, User, Product],
  });

  await dataSource.initialize();
  console.log('🌱 Seeding 25+ orders for pagination test...');

  const user = await dataSource.manager.findOne(User, { where: { email: 'sweet@example.com' } });
  const products = await dataSource.manager.find(Product);

  if (!user || products.length === 0) {
    console.error('❌ User or Products not found. Please run main seed first.');
    process.exit(1);
  }

  for (let i = 1; i <= 25; i++) {
    const order = dataSource.manager.create(Order, {
      user,
      receiverName: 'Liam Sweet',
      phone: '0987654321',
      address: `Sugar Road #${i}, Sweet City`,
      status: i % 2 === 0 ? OrderStatus.COMPLETED : OrderStatus.SHIPPING,
      totalAmount: Math.random() * 100 + 20,
    });

    const savedOrder = await dataSource.manager.save(order);

    const item = dataSource.manager.create(OrderItem, {
      order: savedOrder,
      product: products[0],
      quantity: 1,
      unitPrice: products[0].price,
    });
    await dataSource.manager.save(item);
  }

  console.log('✅ 25 orders created successfully!');
  await dataSource.destroy();
}

seedManyOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
