import { DataSource } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Banner } from '../banners/entities/banner.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { InventoryLog } from '../inventory/entities/inventory-log.entity';
import { Task } from '../tasks/entities/task.entity';
import { OrderStatus } from '../common/constants/order-status.enum';
import { PageVisit } from '../analytics/entities/page-visit.entity';

// Generate a random date between two dates
function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedAnalytics() {
    const dataSource = new DataSource({
        type: 'sqlite',
        database: 'candy_ecommerce.db',
        entities: [Order, OrderItem, User, Product, Category, Banner, AuditLog, InventoryLog, Task, PageVisit],
        synchronize: true, // Automatically create tables for the seed
    });

    await dataSource.initialize();
    console.log('🌱 Bắt đầu tạo dữ liệu mồi cho Analytics (6 tháng gần nhất)...');

    const user = await dataSource.manager.findOne(User, { where: { email: 'sweet@example.com' } });
    const products = await dataSource.manager.find(Product);

    if (!user || products.length === 0) {
        console.error('❌ User or Products not found. Vui lòng chạy seed chính trước.');
        process.exit(1);
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // 1. Tạo 500 Đơn hàng
    console.log('📦 Đang tạo 500 đơn hàng ngẫu nhiên...');
    for (let i = 0; i < 500; i++) {
        const orderDate = randomDate(startDate, endDate);
        
        // Trạng thái phần lớn là DELIVERED, thỉnh thoảng CANCELLED
        const status = Math.random() > 0.1 ? OrderStatus.DELIVERED : OrderStatus.CANCELLED;

        // Chọn 1-3 sản phẩm ngẫu nhiên
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedProducts: Product[] = [];
        let totalAmount = 0;

        for (let j = 0; j < numItems; j++) {
            const prod = products[Math.floor(Math.random() * products.length)];
            selectedProducts.push(prod);
            totalAmount += prod.price; // Giả sử SL = 1 cho nhanh
        }

        const order = dataSource.manager.create(Order, {
            user,
            receiverName: `Customer ${i}`,
            phone: '0987654321',
            address: `Address ${i}, Random City`,
            status: status,
            totalAmount: totalAmount,
        });

        // Bóp méo thời gian tạo đơn hàng
        order.createdAt = orderDate;

        const savedOrder = await dataSource.manager.save(order);

        // Lưu Order Items
        for (const prod of selectedProducts) {
            const item = dataSource.manager.create(OrderItem, {
                order: savedOrder,
                product: prod,
                quantity: 1,
                unitPrice: prod.price,
            });
            await dataSource.manager.save(item);
        }
    }

    // 2. Tạo 1500 Page Visits
    console.log('👀 Đang tạo 1500 lượt truy cập (Page Visits)...');
    for (let i = 0; i < 1500; i++) {
        const visitDate = randomDate(startDate, endDate);
        const visit = dataSource.manager.create(PageVisit, {
            sessionId: `session-${Math.floor(Math.random() * 100000)}`,
        });
        visit.createdAt = visitDate;
        await dataSource.manager.save(visit);
    }

    console.log('✅ Hoàn tất quá trình tạo dữ liệu mồi Analytics!');
    await dataSource.destroy();
}

seedAnalytics().catch(err => {
    console.error(err);
    process.exit(1);
});
