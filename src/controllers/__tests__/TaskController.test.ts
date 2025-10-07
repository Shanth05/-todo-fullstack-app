import { Request, Response } from 'express';
import { TaskController } from '../TaskController';
import { TaskService } from '../../services/TaskService';
import { Task } from '../../models/Task';

// Mock the TaskService
jest.mock('../../services/TaskService');
const MockedTaskService = TaskService as jest.MockedClass<typeof TaskService>;

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskService: jest.Mocked<TaskService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockTaskService = new MockedTaskService() as jest.Mocked<TaskService>;
    taskController = new TaskController();
    (taskController as any).taskService = mockTaskService;

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getRecentTasks', () => {
    it('should return recent tasks successfully', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockTaskService.getRecentTasks.mockResolvedValue(mockTasks);

      await taskController.getRecentTasks(mockRequest as Request, mockResponse as Response);

      expect(mockTaskService.getRecentTasks).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTasks,
        count: mockTasks.length
      });
    });

    it('should handle errors', async () => {
      mockTaskService.getRecentTasks.mockRejectedValue(new Error('Database error'));

      await taskController.getRecentTasks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
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

      mockRequest.body = taskData;
      mockTaskService.createTask.mockResolvedValue(mockCreatedTask);

      // Mock validation result
      const mockValidationResult = {
        isEmpty: () => true,
        array: () => []
      };
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue(mockValidationResult);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedTask,
        message: 'Task created successfully'
      });
    });

    it('should handle validation errors', async () => {
      mockRequest.body = { title: '' }; // Invalid data

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Title is required' }]
      };
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue(mockValidationResult);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [{ msg: 'Title is required' }]
      });
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const taskId = 1;
      mockRequest.params = { id: '1' };

      const mockCompletedTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockTaskService.completeTask.mockResolvedValue(mockCompletedTask);

      await taskController.completeTask(mockRequest as Request, mockResponse as Response);

      expect(mockTaskService.completeTask).toHaveBeenCalledWith(taskId);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCompletedTask,
        message: 'Task completed successfully'
      });
    });

    it('should handle invalid task ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await taskController.completeTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid task ID'
      });
    });

    it('should handle task not found', async () => {
      mockRequest.params = { id: '999' };
      mockTaskService.completeTask.mockResolvedValue(null);

      await taskController.completeTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Task not found or already completed'
      });
    });
  });
});
