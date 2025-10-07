import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get the 5 most recent incomplete tasks
router.get('/', taskController.getRecentTasks);

// GET /api/tasks/check-availability - Check if task name is available
router.get('/check-availability', taskController.checkTaskNameAvailability);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTaskValidation, taskController.createTask);

// GET /api/tasks/:id - Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id/complete - Mark a task as completed
router.put('/:id/complete', taskController.completeTask);

export default router;
