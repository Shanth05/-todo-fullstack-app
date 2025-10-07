import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { TaskService } from '../services/TaskService';
import { CreateTaskRequest } from '../models/Task';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  get createTaskValidation() {
    return [
      body('title')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    ];
  }
  getRecentTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getRecentTasks();
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching recent tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const taskData: CreateTaskRequest = {
        title: req.body.title,
        description: req.body.description || ''
      };

      const newTask = await this.taskService.createTask(taskData);
      
      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  completeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
        return;
      }

      const completedTask = await this.taskService.completeTask(taskId);
      
      if (!completedTask) {
        res.status(404).json({
          success: false,
          message: 'Task not found or already completed'
        });
        return;
      }

      res.json({
        success: true,
        data: completedTask,
        message: 'Task completed successfully'
      });
    } catch (error) {
      console.error('Error completing task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid task ID'
        });
        return;
      }

      const task = await this.taskService.getTaskById(taskId);
      
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  checkTaskNameAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.query;
      
      if (!title || typeof title !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Title is required'
        });
        return;
      }

      const isAvailable = await this.taskService.checkTaskNameAvailability(title.trim());
      
      res.json({
        success: true,
        data: {
          available: isAvailable,
          message: isAvailable ? 'Task name is available' : 'Task name already exists'
        }
      });
    } catch (error) {
      console.error('Error checking task name availability:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
}
