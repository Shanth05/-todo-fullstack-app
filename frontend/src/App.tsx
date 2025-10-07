import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Task, CreateTaskRequest } from './types/Task';
import { taskApi } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);

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

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setIsCreating(true);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks.slice(0, 4)]);
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
          <h1 className="app-title">
            Todo Task Manager
          </h1>
        </header>

        <main className="app-main">
          <div className="app-content">
            <TaskForm 
              onSubmit={handleCreateTask} 
              isLoading={isCreating}
            />
            
            <TaskList
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
              isLoading={isLoading}
              completingTaskId={completingTaskId}
            />
          </div>
        </main>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
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
          fontSize: '14px',
          fontWeight: '500'
        }}
      />
    </div>
  );
};

export default App;
