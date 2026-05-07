import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DataSource, LessThan, Not, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrderStatus } from '../common/constants/order-status.enum';
import { PaymentMethod } from '../common/constants/payment-method.enum';
import { InventoryLog } from '../inventory/entities/inventory-log.entity';
import { CacheHelperService } from '../common/cache-helper.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Coupon } from './entities/coupon.entity';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    private cacheHelper: CacheHelperService,
    private notificationsService: NotificationsService,
  ) { }

  onModuleInit() {
    // Tự động quét đơn hàng hết hạn mỗi 10 phút
    setInterval(() => {
      this.cleanupExpiredOrders().catch(err => console.error('Cleanup failed', err));
    }, 10 * 60 * 1000);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    filters: { status?: OrderStatus; query?: string; startDate?: string; endDate?: string } = {}
  ): Promise<{ data: Order[], meta: any }> {
    const queryBuilder = this.dataSource.manager.createQueryBuilder(Order, 'order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (filters.status) {
      queryBuilder.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters.query) {
      queryBuilder.andWhere(
        '(order.receiverName LIKE :q OR order.phone LIKE :q OR CAST(order.id AS TEXT) LIKE :q)',
        { q: `%${filters.query}%` }
      );
    }

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :start AND :end', { 
        start: new Date(filters.startDate), 
        end: new Date(filters.endDate) 
      });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getMetrics(): Promise<{
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
    cancellationRate: number;
  }> {
    const totalOrders = await this.dataSource.manager.count(Order);
    
    // Revenue from COMPLETED or PAID orders
    const revenueResult = await this.dataSource.manager.createQueryBuilder(Order, 'order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { 
        statuses: [OrderStatus.COMPLETED, OrderStatus.PAID, OrderStatus.CONFIRMED] // Adjusted for available statuses
      })
      .getRawOne();
    
    const pendingOrders = await this.dataSource.manager.count(Order, { 
      where: { status: OrderStatus.PENDING } 
    });

    const cancelledOrders = await this.dataSource.manager.count(Order, { 
      where: { status: OrderStatus.CANCELLED } 
    });

    const cancellationRate = totalOrders > 0 
      ? Math.round((cancelledOrders / totalOrders) * 100) 
      : 0;

    return {
      totalOrders,
      revenue: parseFloat(revenueResult?.total || '0'),
      pendingOrders,
      cancellationRate
    };
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<{ data: Order[], meta: any }> {
    const [data, total] = await this.dataSource.manager.findAndCount(Order, {
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number, userId?: number): Promise<Order> {
    const order = await this.dataSource.manager.findOne(Order, {
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product']
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Security: Check ownership if userId is provided
    if (userId && order.user.id !== userId) {
      throw new BadRequestException('You do not have permission to view this order');
    }

    return order;
  }

  async updateStatus(
    id: number,
    status: OrderStatus,
    metadata: { userId?: number; ip?: string; ua?: string } = {}
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['user', 'orderItems', 'orderItems.product']
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const oldStatus = order.status;

      // Cơ chế Hoàn tất khấu trừ (Commit) & Khôi phục mã (Rollback)
      if (order.couponCode) {
        // 1. Commit: Chuyển từ PENDING sang trạng thái hợp lệ (CONFIRMED/SHIPPED/DELIVERED)
        const activeStatuses = [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.PAID];
        if (oldStatus === OrderStatus.PENDING && activeStatuses.includes(status)) {
          await queryRunner.manager.update(Coupon, { code: order.couponCode }, {
            reservedCount: () => 'reservedCount - 1',
            usageCount: () => 'usageCount + 1'
          });
        }
        // 2. Rollback: Chuyển sang CANCELLED khi vẫn đang PENDING (đang giữ chỗ)
        else if (status === OrderStatus.CANCELLED && oldStatus === OrderStatus.PENDING) {
          await queryRunner.manager.update(Coupon, { code: order.couponCode }, {
            reservedCount: () => 'reservedCount - 1'
          });
        }
        // 3. Refund usage: Chuyển sang CANCELLED sau khi đã Commit
        else if (status === OrderStatus.CANCELLED && activeStatuses.includes(oldStatus)) {
          await queryRunner.manager.update(Coupon, { code: order.couponCode }, {
            usageCount: () => 'usageCount - 1'
          });
        }
      }

      // Logic Hoàn Kho có điều kiện (Selective Return)
      if (status === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
        const allowedStatusesForRefund = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

        if (allowedStatusesForRefund.includes(oldStatus)) {
          const sortedItems = [...order.orderItems].sort((a, b) => a.product.id - b.product.id);

          for (const item of sortedItems) {
            const product = await queryRunner.manager.findOne(Product, {
              where: { id: item.product.id },
            });

            if (!product) continue;

            product.stock += item.quantity;
            await queryRunner.manager.save(product);

            const invLog = queryRunner.manager.create(InventoryLog, {
              productId: product.id,
              orderId: order.id,
              actionType: 'REFUND',
              quantityChange: item.quantity,
              reason: `Order ${order.id} cancelled from ${oldStatus}`,
              userId: metadata.userId || 0,
            });
            await queryRunner.manager.save(invLog);
          }
        }
      }

      order.status = status;
      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      // [THÊM] Thông báo cho User khi trạng thái thay đổi
      await this.notificationsService.createNotification({
        recipientId: order.user.id,
        title: 'Cập nhật trạng thái đơn hàng! 📦',
        content: `Đơn hàng #${order.id} của bạn đã chuyển sang trạng thái: ${status}`,
        type: 'ORDER',
        relatedId: order.id.toString()
      });

      await this.cacheHelper.invalidatePattern('/products');
      await this.cacheHelper.invalidatePattern('/orders');

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    metadata: { userId: number; ip?: string; ua?: string } = { userId: 0 }
  ): Promise<Order> {
    const { userId, receiverName, phone, address, cartItems, couponCode, paymentMethod } = createOrderDto;

    // 1. Anti-Double-Click Protection (Server-side Lock)
    const lockKey = `order_lock_${userId}`;
    const isLocked = await this.cacheHelper.get(lockKey);
    if (isLocked) {
      throw new BadRequestException('Your order is being processed. Please wait a few seconds.');
    }
    await this.cacheHelper.set(lockKey, 'locked', 10); // Lock for 10 seconds

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Fetch User & Validate
      const { 
        receiverName, 
        phone, 
        address, 
        paymentMethod, 
        couponCode, 
        cartItems, 
        shippingMethod = 'STANDARD' 
      } = createOrderDto;
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      // 3. Pricing Engine: Server-side re-calculation
      let subtotal = 0;
      const orderItemsToSave: OrderItem[] = [];
      const sortedCartItems = [...cartItems].sort((a, b) => a.productId - b.productId);

      for (const item of sortedCartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) throw new BadRequestException(`Product #${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Product ${product.productName} is out of stock.`);
        }

        // Deduct inventory
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        // Calculate line item price (Server-side price fetch)
        const currentPrice = Number(product.salePrice || product.price);
        subtotal += currentPrice * item.quantity;

        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          unitPrice: currentPrice,
        });
        orderItemsToSave.push(orderItem);

        // Log inventory change
        await queryRunner.manager.save(InventoryLog, {
          productId: product.id,
          actionType: 'DEDUCTION',
          quantityChange: -item.quantity,
          reason: `Order Creation`,
          userId: userId,
        });
      }

      // 4. Coupon Logic & Reservation (Locking)
      let discountAmount = 0;
      if (couponCode) {
        const couponResult = await this.validateCoupon(couponCode, subtotal, userId);
        discountAmount = couponResult.discountAmount;

        // Cơ chế Giữ chỗ mã (Locking/Reservation):
        // Tạm thời tăng reservedCount để "giữ chỗ" 1 lượt sử dụng
        await queryRunner.manager.update(Coupon, { code: couponCode }, {
          reservedCount: () => 'reservedCount + 1'
        });
      }

      // 5. Final Calculation
      const taxRate = 0.08; // 8% VAT
      const shippingFee = shippingMethod === 'EXPRESS' ? 15 : (subtotal > 50 ? 0 : 5);
      const taxAmount = (subtotal - discountAmount) * taxRate;
      const finalTotal = subtotal - discountAmount + taxAmount + shippingFee;

      // 6. Payment State Machine: Initial state
      let initialStatus = OrderStatus.PENDING;
      if (paymentMethod === PaymentMethod.COD) {
        initialStatus = OrderStatus.CONFIRMED; // COD orders are confirmed automatically if stock is available
      }

      const order = queryRunner.manager.create(Order, {
        user,
        receiverName,
        phone,
        address,
        paymentMethod,
        shippingMethod,
        status: initialStatus,
        totalAmount: Math.round(finalTotal * 100) / 100,
        couponCode: couponCode ?? undefined,
        discountAmount: Math.round(discountAmount * 100) / 100,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Attach items
      for (const item of orderItemsToSave) {
        item.order = savedOrder;
      }
      await queryRunner.manager.save(orderItemsToSave);

      await queryRunner.commitTransaction();

      // 7. Background Notifications (Queue simulation)
      setImmediate(async () => {
        try {
          await this.notificationsService.createNotification({
            recipientId: userId,
            title: 'Order Created! 🍭',
            content: `Your order #${savedOrder.id} has been placed. Status: ${initialStatus}`,
            type: 'ORDER',
            relatedId: savedOrder.id.toString()
          });
          await this.notificationsService.notifyAdmins('New Order! 🚀', `Order #${savedOrder.id} from User #${userId}`);
        } catch (e) {
          console.error('Async notification failed', e);
        }
      });

      await this.cacheHelper.invalidatePattern('/products');
      await this.cacheHelper.invalidatePattern('/orders');

      return savedOrder;
    } catch (error) {
      if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      await this.cacheHelper.del(lockKey); // Unlock immediately after processing
    }
  }

  /**
   * Logic IPN: Confirm payment from Gateway
   */
  async handlePaymentIPN(orderId: number, transactionId: string): Promise<void> {
    const order = await this.dataSource.manager.findOne(Order, { where: { id: orderId } });
    if (order && order.status === OrderStatus.PENDING) {
      await this.updateStatus(orderId, OrderStatus.PAID, { ua: 'IPN Gateway' });
    }
  }

  /**
   * Logic Expiry: Cleanup pending orders after timeout (e.g., 30 mins)
   */
  async cleanupExpiredOrders(): Promise<number> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const expiredOrders = await this.dataSource.manager.find(Order, {
      where: {
        status: OrderStatus.PENDING,
        createdAt: LessThan(thirtyMinutesAgo),
      },
      relations: ['orderItems', 'orderItems.product']
    });

    for (const order of expiredOrders) {
      await this.updateStatus(order.id, OrderStatus.CANCELLED, { reason: 'Payment Timeout' } as any);
    }

    return expiredOrders.length;
  }

  async validateCoupon(code: string, subtotal: number, userId?: number): Promise<{ discountAmount: number, discountType: string, discountValue: number, code: string }> {
    const coupon = await this.dataSource.manager.findOne(Coupon, { 
      where: { code, isActive: true } 
    });
    
    // Auto-seed if not exists for testing
    if (!coupon && code === 'CANDYLOVE2024') {
      await this.manualSeedCoupons();
      return this.validateCoupon(code, subtotal, userId);
    }

    // 1. Kiểm tra tồn tại và trạng thái
    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa');
    }

    // 2. Kiểm tra hiệu lực thời gian
    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) {
      throw new BadRequestException('Mã giảm giá chưa đến thời gian sử dụng');
    }
    if (coupon.endDate && coupon.endDate < now) {
      throw new BadRequestException('Mã giảm giá đã hết hạn sử dụng');
    }

    // 3. Kiểm tra số lượt dùng (Toàn hệ thống)
    // Tổng số lượt đang dùng + đang giữ chỗ
    const totalEffectiveUsage = Number(coupon.usageCount) + Number(coupon.reservedCount);
    if (coupon.maxUsage && totalEffectiveUsage >= coupon.maxUsage) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng (toàn hệ thống)');
    }

    // 4. Kiểm tra số lượt dùng (Cá nhân User)
    if (userId) {
      const userUsageCount = await this.dataSource.manager.count(Order, {
        where: { user: { id: userId }, couponCode: code, status: Not(In([OrderStatus.CANCELLED, OrderStatus.REFUNDED])) }
      });
      if (coupon.limitPerUser && userUsageCount >= coupon.limitPerUser) {
        throw new BadRequestException('Bạn đã hết lượt sử dụng mã giảm giá này');
      }
    }

    // 5. Kiểm tra giá trị đơn hàng tối thiểu
    if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
      throw new BadRequestException(`Đơn hàng tối thiểu $${coupon.minOrderValue} để áp dụng mã này`);
    }

    // 6. Tính toán số tiền giảm
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = subtotal * (Number(coupon.discountValue) / 100);
      // Áp dụng mức giảm tối đa nếu có
      if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
        discountAmount = Number(coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    return {
      code: coupon.code,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue)
    };
  }

  async manualSeedCoupons() {
    const code = 'CANDYLOVE2024';
    const existing = await this.dataSource.manager.findOne(Coupon, { where: { code } });
    if (!existing) {
      const coupon = this.dataSource.manager.create(Coupon, {
        code,
        discountType: 'percent',
        discountValue: 20,
        isActive: true,
        minOrderValue: 10,
        maxUsage: 100,
        usageCount: 0
      });
      await this.dataSource.manager.save(coupon);
    }
  }

  async getPurchasedProductIds(userId: number): Promise<number[]> {
    const orders = await this.dataSource.manager.find(Order, {
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });

    const productIds = new Set<number>();
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product) productIds.add(item.product.id);
      });
    });

    return Array.from(productIds);
  }
}
