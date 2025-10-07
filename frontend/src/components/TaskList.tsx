import React from 'react';
import { Task } from '../types/Task';
import TaskCard from './TaskCard';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (id: number) => void;
  isLoading?: boolean;
  completingTaskId?: number | null;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onCompleteTask, 
  isLoading = false,
  completingTaskId = null 
}) => {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="task-list" data-testid="task-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list" data-testid="task-list">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list" data-testid="task-list">
      <div className="task-list-header">
        <h2>Recent Tasks</h2>
        <span className="task-count">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      
      <div className="task-cards-container">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onCompleteTask}
            isLoading={completingTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
