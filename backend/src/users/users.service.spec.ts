import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('nên trả về danh sách người dùng', async () => {
      const users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('nên trả về người dùng if found', async () => {
      const user = { id: 1, name: 'User 1' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('nên báo lỗi nếu không tìm thấy người dùng', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('nên tạo người dùng mới', async () => {
      const userData = { email: 'test@example.com', name: 'Test' };
      mockRepository.findOne.mockResolvedValue(null); // Không trùng email
      mockRepository.create.mockReturnValue(userData);
      mockRepository.save.mockResolvedValue({ id: 1, ...userData });

      const result = await service.create(userData);

      expect(result.id).toBe(1);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('nên báo lỗi nếu email đã tồn tại', async () => {
      const userData = { email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue({ id: 1, ...userData });

      await expect(service.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('nên cập nhật thông tin người dùng', async () => {
      const user = { id: 1, name: 'Old Name' };
      const updatedData = { name: 'New Name' };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce({ ...user, ...updatedData });

      const result = await service.update(1, updatedData);

      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('nên xóa người dùng', async () => {
      const user = { id: 1, name: 'User 1' };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      const result = await service.remove(1);

      expect(result).toEqual(user);
      expect(mockRepository.remove).toHaveBeenCalledWith(user);
    });
  });
});
