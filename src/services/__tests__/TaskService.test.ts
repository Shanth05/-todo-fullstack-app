import { TaskService } from '../TaskService';
import { pool } from '../../config/database';
import { Task } from '../../models/Task';

// Mock the database pool
jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('getRecentTasks', () => {
    it('should return the 5 most recent incomplete tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: new Date('2023-12-01'),
          updated_at: new Date('2023-12-01')
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: false,
          created_at: new Date('2023-12-02'),
          updated_at: new Date('2023-12-02')
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockTasks } as any);

      const result = await taskService.getRecentTasks();

      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE completed = false'));
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('LIMIT 5'));
      expect(result).toEqual(mockTasks);
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.getRecentTasks()).rejects.toThrow('Database error');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description'
      };

      const mockCreatedTask: Task = {
        id: 1,
        title: 'New Task',
        description: 'New Description',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockCreatedTask] } as any);

      const result = await taskService.createTask(taskData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO task'),
        ['New Task', 'New Description', false]
      );
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('completeTask', () => {
    it('should mark a task as completed', async () => {
      const taskId = 1;
      const mockCompletedTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockCompletedTask] } as any);

      const result = await taskService.completeTask(taskId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE task'),
        [taskId]
      );
      expect(result).toEqual(mockCompletedTask);
    });

    it('should return null if task not found or already completed', async () => {
      const taskId = 999;
      mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

      const result = await taskService.completeTask(taskId);

      expect(result).toBeNull();
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const taskId = 1;
      const mockTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockTask] } as any);

      const result = await taskService.getTaskById(taskId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [taskId]
      );
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      const taskId = 999;
      mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

      const result = await taskService.getTaskById(taskId);

      expect(result).toBeNull();
    });
  });
});
