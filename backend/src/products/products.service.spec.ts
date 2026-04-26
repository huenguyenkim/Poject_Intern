import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('nên trả về tất cả sản phẩm cùng category', async () => {
      const products = [{ id: 1, product_name: 'Candy A', category: { id: 1 } }];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['category'] });
    });
  });

  describe('findOne', () => {
    it('nên trả về sản phẩm if found', async () => {
      const product = { id: 1, product_name: 'Candy A' };
      mockRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(result).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category'],
      });
    });

    it('nên báo lỗi nếu không tìm thấy', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('nên tạo sản phẩm mới', async () => {
      const data = { product_name: 'New Candy', price: 100 };
      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockResolvedValue({ id: 1, ...data });

      const result = await service.create(data);

      expect(result.id).toBe(1);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('nên cập nhật sản phẩm', async () => {
      const product = { id: 1, product_name: 'Old Candy' };
      const updatedData = { product_name: 'New Candy' };
      mockRepository.findOne.mockResolvedValue(product);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(product).mockResolvedValueOnce({ ...product, ...updatedData });

      const result = await service.update(1, updatedData);

      expect(result.product_name).toBe('New Candy');
    });
  });

  describe('remove', () => {
    it('nên xóa sản phẩm', async () => {
      const product = { id: 1, product_name: 'Candy A' };
      mockRepository.findOne.mockResolvedValue(product);
      mockRepository.remove.mockResolvedValue(product);

      const result = await service.remove(1);

      expect(result).toEqual(product);
      expect(mockRepository.remove).toHaveBeenCalled();
    });
  });
});
