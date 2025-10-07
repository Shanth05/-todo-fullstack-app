import { Task } from '../models/Task';

// Mock database for development when PostgreSQL is not available
class MockDatabase {
  public tasks: Task[] = [];
  public nextId = 1;

  async query(sql: string, params: any[] = []): Promise<{ rows: any[]; rowCount?: number }> {
    console.log('Mock DB Query:', sql, params);
    
    if (sql.includes('SELECT') && sql.includes('WHERE completed = false')) {
      const incompleteTasks = this.tasks
        .filter(task => !task.completed)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      return { rows: incompleteTasks };
    }
    
    if (sql.includes('INSERT INTO task')) {
      const newTask: Task = {
        id: this.nextId++,
        title: params[0],
        description: params[1],
        completed: params[2],
        created_at: new Date(),
        updated_at: new Date()
      };
      this.tasks.push(newTask);
      return { rows: [newTask] };
    }
    
    if (sql.includes('UPDATE task') && sql.includes('completed = true')) {
      const taskId = params[0];
      const taskIndex = this.tasks.findIndex(task => task.id === taskId && !task.completed);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].completed = true;
        this.tasks[taskIndex].updated_at = new Date();
        return { rows: [this.tasks[taskIndex]] };
      }
      return { rows: [] };
    }
    
    if (sql.includes('SELECT') && sql.includes('WHERE id =')) {
      const taskId = params[0];
      const task = this.tasks.find(task => task.id === taskId);
      return { rows: task ? [task] : [] };
    }
    
    if (sql.includes('DELETE FROM task')) {
      const taskId = params[0];
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        this.tasks.splice(taskIndex, 1);
        return { rows: [], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }
    
    if (sql.includes('SELECT COUNT(*)') && sql.includes('WHERE LOWER(title) = LOWER')) {
      const titleToCheck = params[0];
      const count = this.tasks.filter(task => 
        task.title.toLowerCase() === titleToCheck.toLowerCase() && 
        !task.completed
      ).length;
      return { rows: [{ count: count.toString() }] };
    }
    
    return { rows: [] };
  }

  async connect() {
    console.log('Mock database connected');
    return { 
      release: () => {},
      query: this.query.bind(this)
    };
  }

  async end() {
    console.log('Mock database connection ended');
  }
}

export const mockPool = new MockDatabase();
