import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      const mockTask = new Task();
      mockTask.id = '123';
      repo.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('123');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const mockTask = new Task();
      mockTask.id = '123';
      mockTask.status = TaskStatus.TODO;
      
      repo.findOne.mockResolvedValue(mockTask);
      repo.save.mockResolvedValue({ ...mockTask, status: TaskStatus.DONE });

      const result = await service.update('123', { status: TaskStatus.DONE });
      expect(repo.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
