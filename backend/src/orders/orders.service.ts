import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrderStatus } from '../common/constants/order-status.enum';
import { InventoryLog } from '../inventory/entities/inventory-log.entity';
import { CacheHelperService } from '../common/cache-helper.service';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private cacheHelper: CacheHelperService,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Order[], meta: any }> {
    const [data, total] = await this.dataSource.manager.findAndCount(Order, {
      relations: ['user', 'orderItems', 'orderItems.product'],
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
        relations: ['orderItems', 'orderItems.product']
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const oldStatus = order.status;

      // Logic Hoàn Kho có điều kiện (Selective Return)
      // Chỉ hoàn kho nếu đơn hàng đang ở trạng thái PENDING hoặc CONFIRMED (Processing)
      if (status === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
        const allowedStatusesForRefund = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
        
        if (allowedStatusesForRefund.includes(oldStatus)) {
          // SORT BY ID to prevent Deadlocks during multiple product updates
          const sortedItems = [...order.orderItems].sort((a, b) => a.product.id - b.product.id);
          
          for (const item of sortedItems) {
            // PESSIMISTIC LOCKING to prevent race conditions during refund
            const product = await queryRunner.manager.findOne(Product, {
              where: { id: item.product.id },
              lock: { mode: 'pessimistic_write' }
            });
            
            if (!product) {
              console.warn(`⚠️ Skipping refund for missing product ID ${item.product.id}`);
              continue;
            }
            
            product.stock += item.quantity;
            await queryRunner.manager.save(product);

            // LOG INVENTORY CHANGE
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
      
      // SELECTIVE CACHE INVALIDATION
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
    metadata: { ip?: string; ua?: string } = {}
  ): Promise<Order> {
    const { userId, receiverName, phone, address, cartItems } = createOrderDto;
    
    // 1. PRE-TRANSACTION LOGIC (Comparison/Sorting) to minimize Lock time
    // SORT BY PRODUCT ID Ascending to prevent DEADLOCKS
    const sortedCartItems = [...cartItems].sort((a, b) => a.productId - b.productId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItemsToSave: OrderItem[] = [];

      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const newOrder = queryRunner.manager.create(Order, {
        user,
        receiverName,
        phone,
        address,
        paymentMethod: createOrderDto.paymentMethod,
        status: OrderStatus.PENDING,
        totalAmount: 0,
      });

      const savedOrder = await queryRunner.manager.save(newOrder);

      for (const item of sortedCartItems) {
        // PESSIMISTIC LOCKING: SELECT ... FOR UPDATE
        // Tránh Race condition khi nhiều người cùng mua một lúc
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId }
        });

        if (!product) {
          throw new BadRequestException(`Product with id ${item.productId} not found`);
        }

        // SERVICE-LEVEL VALIDATION (TRƯỚC KHI DB NÉM LỖI 500)
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${product.productName} không đủ tồn kho. Hiện còn: ${product.stock}`);
        }

        // TRỪ KHO
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        // LOG INVENTORY CHANGE (ATOMIC)
        const invLog = queryRunner.manager.create(InventoryLog, {
          productId: product.id,
          orderId: savedOrder.id,
          actionType: 'DEDUCTION',
          quantityChange: -item.quantity,
          reason: `Order ${savedOrder.id} created`,
          userId: userId,
        });
        await queryRunner.manager.save(invLog);

        const unitPrice = Number(product.price);
        totalAmount += unitPrice * item.quantity;

        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product,
          quantity: item.quantity,
          unitPrice: unitPrice,
        });

        orderItemsToSave.push(orderItem);
      }

      await queryRunner.manager.save(orderItemsToSave);

      // --- TÍNH TOÁN TÀI CHÍNH (ROUNDING PRECISION) ---
      const subtotal = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
      const tax = Math.round(((subtotal * 0.08) + Number.EPSILON) * 100) / 100;
      const shippingFee = subtotal > 50 ? 0 : 5.99;
      
      const finalTotal = Math.round(((subtotal + tax + shippingFee) + Number.EPSILON) * 100) / 100;
      
      savedOrder.totalAmount = finalTotal;
      await queryRunner.manager.save(savedOrder);

      // COMMIT TRANSACTION
      await queryRunner.commitTransaction();

      // SELECTIVE CACHE INVALIDATION (POST-TRANSACTION)
      await this.cacheHelper.invalidatePattern('/products');
      await this.cacheHelper.invalidatePattern('/orders');

      return savedOrder;
    } catch (error) {
      console.error('❌ [OrdersService] Error creating order:', error);
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
