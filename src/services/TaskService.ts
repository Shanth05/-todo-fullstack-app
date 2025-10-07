import { pool } from '../config/database';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/Task';

export class TaskService {
  /**
   * Get the 5 most recent incomplete tasks
   */
  async getRecentTasks(): Promise<Task[]> {
    const query = `
      SELECT id, title, description, completed, created_at, updated_at
      FROM task
      WHERE completed = false
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const { title, description } = taskData;
    
    const query = `
      INSERT INTO task (title, description, completed, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, title, description, completed, created_at, updated_at
    `;
    
    const result = await pool.query(query, [title, description, false]);
    return result.rows[0];
  }

  /**
   * Mark a task as completed
   */
  async completeTask(id: number): Promise<Task | null> {
    const query = `
      UPDATE task
      SET completed = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND completed = false
      RETURNING id, title, description, completed, created_at, updated_at
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get a task by ID
   */
  async getTaskById(id: number): Promise<Task | null> {
    const query = `
      SELECT id, title, description, completed, created_at, updated_at
      FROM task
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update a task
   */
  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (taskData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(taskData.title);
    }

    if (taskData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(taskData.description);
    }

    if (taskData.completed !== undefined) {
      fields.push(`completed = $${paramCount++}`);
      values.push(taskData.completed);
    }

    if (fields.length === 0) {
      return this.getTaskById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE task
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, title, description, completed, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<boolean> {
    const query = 'DELETE FROM task WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
}
