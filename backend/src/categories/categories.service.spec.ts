import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

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
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('nên trả về tất cả danh mục cùng sản phẩm', async () => {
      const categories = [{ id: 1, category_name: 'Candy', products: [] }];
      mockRepository.find.mockResolvedValue(categories);
      const result = await service.findAll();
      expect(result).toEqual(categories);
      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['products'] });
    });
  });

  describe('findOne', () => {
    it('nên trả về danh mục if found', async () => {
      const category = { id: 1, category_name: 'Candy' };
      mockRepository.findOne.mockResolvedValue(category);
      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('nên báo lỗi nếu không tìm thấy', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('nên tạo danh mục mới', async () => {
      const data = { category_name: 'New Cat' };
      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockResolvedValue({ id: 1, ...data });
      const result = await service.create(data);
      expect(result.id).toBe(1);
    });
  });

  describe('remove', () => {
    it('nên xóa danh mục', async () => {
      const category = { id: 1 };
      mockRepository.findOne.mockResolvedValue(category);
      mockRepository.remove.mockResolvedValue(category);
      const result = await service.remove(1);
      expect(result).toEqual(category);
    });
  });
});
