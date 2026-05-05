import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { PageVisit } from './entities/page-visit.entity';
import { OrderStatus } from '../common/constants/order-status.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(PageVisit)
    private readonly visitRepository: Repository<PageVisit>,
    private readonly dataSource: DataSource
  ) {}

  async recordVisit(sessionId: string) {
    // Basic deduplication could be added here, but for now we trust the frontend session check
    const visit = this.visitRepository.create({ sessionId });
    await this.visitRepository.save(visit);
    return { success: true };
  }

  async getKpis(days: number = 180) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalRevenueResult = await this.orderRepository.createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where("order.status = :status", { status: OrderStatus.DELIVERED })
      .andWhere("order.createdAt >= :startDate", { startDate })
      .getRawOne();
    
    const totalRevenue = parseFloat(totalRevenueResult?.total || 0);
    const totalOrders = await this.orderRepository.createQueryBuilder('order')
      .where("order.createdAt >= :startDate", { startDate })
      .getCount();
      
    const totalVisits = await this.visitRepository.createQueryBuilder('visit')
      .where("visit.createdAt >= :startDate", { startDate })
      .getCount();

    const conversionRate = totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(2) : 0;

    return {
      totalRevenue,
      totalOrders,
      totalVisits,
      conversionRate: parseFloat(conversionRate as string)
    };
  }

  async getRevenueChart(days: number = 180) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const isSQLite = this.dataSource.options.type === 'sqlite';
    const dateSelect = isSQLite ? "strftime('%Y-%m-%d', order.created_at)" : "DATE_FORMAT(order.created_at, '%Y-%m-%d')";

    const rawData = await this.orderRepository.createQueryBuilder('order')
      .select(dateSelect, 'date')
      .addSelect('SUM(order.total_amount)', 'revenue')
      .where("order.status = :status", { status: OrderStatus.DELIVERED })
      .andWhere("order.createdAt >= :startDate", { startDate })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return rawData.map(item => ({
      date: item.date,
      revenue: parseFloat(item.revenue || 0)
    }));
  }

  async getForecast() {
    // 1. Lấy dữ liệu 6 tháng gần nhất để làm mẫu (Sample)
    const history = await this.getRevenueChart(180);
    if (history.length < 2) return { predictedRevenue: 0, trend: 'stable' };

    // 2. Thuật toán Hồi quy tuyến tính đơn giản (Simple Linear Regression: y = mx + b)
    // x: Thứ tự tháng (0, 1, 2...), y: Doanh thu
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    history.forEach((data, index) => {
      sumX += index;
      sumY += data.revenue;
      sumXY += index * data.revenue;
      sumX2 += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 3. Dự báo cho tháng tiếp theo (x = n)
    const predictedRevenue = slope * n + intercept;
    
    return {
      predictedRevenue: Math.max(0, parseFloat(predictedRevenue.toFixed(2))),
      trend: slope > 0 ? 'up' : 'down',
      confidence: 0.85 // Giả lập độ tin cậy
    };
  }

  async getBundledProducts() {
    // 1. Lấy tất cả các OrderItems nhóm theo OrderId cho các đơn hàng có > 1 món
    const rawBundles = await this.orderItemRepository.createQueryBuilder('item')
      .select('item.order', 'orderId')
      .addSelect('product.id', 'productId')
      .addSelect('product.productName', 'productName')
      .innerJoin('item.product', 'product')
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('oi.order')
          .from(OrderItem, 'oi')
          .groupBy('oi.order')
          .having('COUNT(oi.id) > 1')
          .getQuery();
        return 'item.order IN ' + subQuery;
      })
      .getRawMany();

    // 2. Xử lý logic ghép cặp (Pairing) tại Application Level
    const ordersMap = new Map<number, string[]>();
    rawBundles.forEach(row => {
      if (!ordersMap.has(row.orderId)) ordersMap.set(row.orderId, []);
      const productNames = ordersMap.get(row.orderId);
      if (productNames) {
        productNames.push(row.productName);
      }
    });

    const pairsCount = new Map<string, number>();
    ordersMap.forEach(products => {
      for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
          const pair = [products[i], products[j]].sort().join(' + ');
          pairsCount.set(pair, (pairsCount.get(pair) || 0) + 1);
        }
      }
    });

    // 3. Lấy Top 3 cặp hay đi cùng nhau nhất
    const sortedPairs = Array.from(pairsCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([bundle, count]) => ({ bundle, count }));

    return sortedPairs;
  }

  async getTopProducts() {
    const topProducts = await this.orderItemRepository.createQueryBuilder('item')
      .select('product.id', 'id')
      .addSelect('product.productName', 'name')
      .addSelect('product.imageUrl', 'imageUrl')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .innerJoin('item.product', 'product')
      .innerJoin('item.order', 'order')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('product.id')
      .orderBy('totalSold', 'DESC')
      .limit(5)
      .getRawMany();

    return topProducts.map(item => ({
      ...item,
      totalSold: parseInt(item.totalSold, 10)
    }));
  }
}
