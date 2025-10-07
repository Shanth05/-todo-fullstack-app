import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Task, CreateTaskRequest } from './types/Task';
import { taskApi } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await taskApi.getRecentTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setIsCreating(true);
      const newTask = await taskApi.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      setTasks(prevTasks => [newTask, ...prevTasks.slice(0, 4)]);
      setFormData({ title: '', description: '' });
      toast.success('Task created successfully!');
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      setCompletingTaskId(taskId);
      await taskApi.completeTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task completed successfully!');
    } catch (error: any) {
      console.error('Error completing task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete task. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Todo Task Manager</h1>
        </header>

        <main className="app-main">
          <div className="app-content">
            {/* Add Task Form */}
            <div className="task-form">
              <h2>Add a Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title..."
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description (optional)..."
                    rows={3}
                    disabled={isCreating}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isCreating || !formData.title.trim()}
                >
                  {isCreating ? 'Creating...' : 'Add Task'}
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="task-list">
              <div className="task-list-header">
                <h2>Recent Tasks</h2>
                <span className="task-count">{tasks.length} tasks</span>
              </div>
              
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started!</p>
                </div>
              ) : (
                <div className="task-cards-container">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <h3 className="task-title">{task.title}</h3>
                        <span className="task-date">
                          {new Date(task.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      
                      <div className="task-actions">
                        <button
                          className="complete-button"
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={completingTaskId === task.id}
                        >
                          {completingTaskId === task.id ? 'Processing...' : 'Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
        theme="colored"
        toastStyle={{
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          minHeight: '40px',
          padding: '8px 12px'
        }}
      />
    </div>
  );
};

export default App;