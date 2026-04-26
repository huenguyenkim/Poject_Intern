import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BannersService } from './banners.service';
import { Banner } from './entities/banner.entity';

describe('BannersService', () => {
  let service: BannersService;
  let repository: Repository<Banner>;

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
        BannersService,
        {
          provide: getRepositoryToken(Banner),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BannersService>(BannersService);
    repository = module.get<Repository<Banner>>(getRepositoryToken(Banner));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('nên trả về tất cả banner', async () => {
      const banners = [{ id: 1, title: 'Banner 1' }];
      mockRepository.find.mockResolvedValue(banners);
      const result = await service.findAll();
      expect(result).toEqual(banners);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('nên trả về banner if found', async () => {
      const banner = { id: 1, title: 'Banner 1' };
      mockRepository.findOne.mockResolvedValue(banner);
      const result = await service.findOne(1);
      expect(result).toEqual(banner);
    });

    it('nên báo lỗi nếu không tìm thấy', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('nên tạo banner mới', async () => {
      const data = { title: 'New Banner', image_url: 'http://test.com/img.jpg' };
      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockResolvedValue({ id: 1, ...data });
      const result = await service.create(data);
      expect(result.id).toBe(1);
    });
  });

  describe('remove', () => {
    it('nên xóa banner', async () => {
      const banner = { id: 1 };
      mockRepository.findOne.mockResolvedValue(banner);
      mockRepository.remove.mockResolvedValue(banner);
      const result = await service.remove(1);
      expect(result).toEqual(banner);
    });
  });
});
