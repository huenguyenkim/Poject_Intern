import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { TaskTriggerService } from './task-trigger.service';
import { Task, TaskPriority } from './entities/task.entity';

describe('TaskTriggerService', () => {
  let service: TaskTriggerService;
  let repo: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskTriggerService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskTriggerService>(TaskTriggerService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrderTask', () => {
    const mockOrderUuid = '1234-abcd';

    it('should create and save a task successfully', async () => {
      const mockTask = new Task();
      jest.spyOn(repo, 'create').mockReturnValue(mockTask);
      jest.spyOn(repo, 'save').mockResolvedValue(mockTask);

      const result = await service.createOrderTask(mockOrderUuid);

      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
        orderUuid: mockOrderUuid,
        title: expect.stringContaining('1234'),
        priority: TaskPriority.HIGH,
      }));
      expect(repo.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });

    it('should return null when a duplicate key error (UNIQUE constraint) occurs to handle race condition gracefully', async () => {
      const mockTask = new Task();
      jest.spyOn(repo, 'create').mockReturnValue(mockTask);
      
      const error = new QueryFailedError('query', [], new Error());
      error.message = 'ER_DUP_ENTRY: Duplicate entry'; // Bắt lỗi MySQL
      
      jest.spyOn(repo, 'save').mockRejectedValue(error);

      const result = await service.createOrderTask(mockOrderUuid);

      expect(result).toBeNull();
    });

    it('should throw an error for other types of QueryFailedErrors', async () => {
      const mockTask = new Task();
      jest.spyOn(repo, 'create').mockReturnValue(mockTask);
      
      const error = new QueryFailedError('query', [], new Error());
      error.message = 'ER_SYNTAX_ERROR: Syntax error';
      
      jest.spyOn(repo, 'save').mockRejectedValue(error);

      await expect(service.createOrderTask(mockOrderUuid)).rejects.toThrow(QueryFailedError);
    });
  });
});
