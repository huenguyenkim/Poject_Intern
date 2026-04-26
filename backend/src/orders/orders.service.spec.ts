import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner, EntityManager } from 'typeorm';
import { OrdersService } from './orders.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../common/constants/order-status.enum';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let manager: EntityManager;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = mockQueryRunner as any;
    manager = mockQueryRunner.manager as any;
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const createOrderDto = {
      userId: 1,
      receiverName: 'Test Recipient',
      phone: '0123456789',
      address: '123 Test St',
      cartItems: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    it('nên tạo đơn hàng thành công và tính đúng tổng tiền', async () => {
      const user = { id: 1, name: 'Test User' };
      const product1 = { id: 1, product_name: 'Candy A', price: 50 };
      const product2 = { id: 2, product_name: 'Candy B', price: 100 };
      const mockOrder = { id: 10, ...createOrderDto, totalAmount: 0 };

      (manager.findOne as jest.Mock)
        .mockResolvedValueOnce(user) // User check
        .mockResolvedValueOnce(product1) // Product 1 check
        .mockResolvedValueOnce(product2); // Product 2 check

      (manager.create as jest.Mock)
        .mockReturnValueOnce(mockOrder) // Order creation
        .mockReturnValueOnce({ id: 101 }) // OrderItem 1
        .mockReturnValueOnce({ id: 102 }); // OrderItem 2

      (manager.save as jest.Mock)
        .mockResolvedValueOnce(mockOrder) // Save initial order
        .mockResolvedValueOnce([{}, {}]) // Save order items
        .mockResolvedValueOnce({ ...mockOrder, totalAmount: 200 }); // Save final order

      const result = await service.createOrder(createOrderDto);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result.totalAmount).toBe(200); // (50*2) + (100*1)
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('nên báo lỗi BadRequest nếu không tìm thấy người dùng', async () => {
      (manager.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(InternalServerErrorException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('nên báo lỗi nếu không tìm thấy sản phẩm', async () => {
      const user = { id: 1 };
      (manager.findOne as jest.Mock)
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(null); // Product 1 not found

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(InternalServerErrorException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
