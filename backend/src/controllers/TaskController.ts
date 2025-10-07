import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { TaskService } from '../services/TaskService';
import { CreateTaskRequest } from '../models/Task';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Validation rules for creating a task
   */
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

  /**
   * Get the 5 most recent incomplete tasks
   */
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

  /**
   * Create a new task
   */
  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check validation errors
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

  /**
   * Mark a task as completed
   */
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

  /**
   * Get a task by ID
   */
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
}
