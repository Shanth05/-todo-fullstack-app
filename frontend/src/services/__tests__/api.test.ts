import axios from 'axios';
import { taskApi } from '../api';
import { Task, CreateTaskRequest } from '../../types/Task';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

describe('taskApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecentTasks', () => {
    it('should return tasks on successful response', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: '2023-12-01T10:00:00Z',
          updated_at: '2023-12-01T10:00:00Z',
        },
      ];

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            success: true,
            data: mockTasks,
          },
        }),
      } as any);

      const result = await taskApi.getRecentTasks();
      expect(result).toEqual(mockTasks);
    });

    it('should throw error on unsuccessful response', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            success: false,
            message: 'Failed to fetch tasks',
          },
        }),
      } as any);

      await expect(taskApi.getRecentTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData: CreateTaskRequest = {
        title: 'New Task',
        description: 'New Description',
      };

      const mockCreatedTask: Task = {
        id: 1,
        ...taskData,
        completed: false,
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2023-12-01T10:00:00Z',
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            success: true,
            data: mockCreatedTask,
          },
        }),
      } as any);

      const result = await taskApi.createTask(taskData);
      expect(result).toEqual(mockCreatedTask);
    });

    it('should throw error on unsuccessful response', async () => {
      const taskData: CreateTaskRequest = {
        title: 'New Task',
        description: 'New Description',
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({
          data: {
            success: false,
            message: 'Validation failed',
          },
        }),
      } as any);

      await expect(taskApi.createTask(taskData)).rejects.toThrow('Validation failed');
    });
  });

  describe('completeTask', () => {
    it('should complete task successfully', async () => {
      const taskId = 1;
      const mockCompletedTask: Task = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2023-12-01T10:00:00Z',
      };

      mockedAxios.create.mockReturnValue({
        put: jest.fn().mockResolvedValue({
          data: {
            success: true,
            data: mockCompletedTask,
          },
        }),
      } as any);

      const result = await taskApi.completeTask(taskId);
      expect(result).toEqual(mockCompletedTask);
    });

    it('should throw error on unsuccessful response', async () => {
      const taskId = 1;

      mockedAxios.create.mockReturnValue({
        put: jest.fn().mockResolvedValue({
          data: {
            success: false,
            message: 'Task not found',
          },
        }),
      } as any);

      await expect(taskApi.completeTask(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('getTaskById', () => {
    it('should return task by ID', async () => {
      const taskId = 1;
      const mockTask: Task = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2023-12-01T10:00:00Z',
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            success: true,
            data: mockTask,
          },
        }),
      } as any);

      const result = await taskApi.getTaskById(taskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw error on unsuccessful response', async () => {
      const taskId = 1;

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            success: false,
            message: 'Task not found',
          },
        }),
      } as any);

      await expect(taskApi.getTaskById(taskId)).rejects.toThrow('Task not found');
    });
  });
});
