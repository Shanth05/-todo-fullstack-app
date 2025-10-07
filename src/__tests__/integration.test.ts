import request from 'supertest';
import express from 'express';
import cors from 'cors';
import taskRoutes from '../routes/taskRoutes';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';

// Create test app
const createTestApp = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  app.use('/api/tasks', taskRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return app;
};

// Mock the database for integration tests
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

const { pool } = require('../config/database');
const mockPool = pool as jest.Mocked<typeof pool>;

describe('Task API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return recent tasks', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockTasks });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockTasks,
        count: mockTasks.length
      });
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/tasks')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description'
      };

      const mockCreatedTask = {
        id: 1,
        ...taskData,
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockCreatedTask] });

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: mockCreatedTask,
        message: 'Task created successfully'
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/tasks/:id/complete', () => {
    it('should complete a task', async () => {
      const taskId = 1;
      const mockCompletedTask = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockCompletedTask] });

      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCompletedTask,
        message: 'Task completed successfully'
      });
    });

    it('should handle invalid task ID', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid/complete')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid task ID');
    });

    it('should handle task not found', async () => {
      const taskId = 999;
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found or already completed');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
      const taskId = 1;
      const mockTask = {
        id: taskId,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockTask
      });
    });

    it('should handle task not found', async () => {
      const taskId = 999;
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });
});
