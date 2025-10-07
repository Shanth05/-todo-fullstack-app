import { Task, CreateTaskRequest, ApiResponse } from '../types/Task';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making ${options.method || 'GET'} request to ${url}`);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const taskApi = {
  getRecentTasks: async (): Promise<Task[]> => {
    const response = await apiRequest<Task[]>('/tasks');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch tasks');
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create task');
  },

  completeTask: async (id: number): Promise<Task> => {
    const response = await apiRequest<Task>(`/tasks/${id}/complete`, {
      method: 'PUT',
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to complete task');
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiRequest<Task>(`/tasks/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch task');
  },

  checkTaskNameAvailability: async (title: string): Promise<{ available: boolean; message: string }> => {
    const response = await apiRequest<{ available: boolean; message: string }>(`/tasks/check-availability?title=${encodeURIComponent(title)}`);
    if (response.success && response.data) {
      return { available: response.data.available, message: response.data.message };
    }
    throw new Error(response.message || 'Failed to check task name availability');
  },
};

export default taskApi;