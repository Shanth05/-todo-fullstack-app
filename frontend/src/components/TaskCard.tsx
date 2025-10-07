import React from 'react';
import { Task } from '../types/Task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  isLoading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, isLoading = false }) => {
  const handleComplete = () => {
    onComplete(task.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="task-card" data-testid={`task-card-${task.id}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-date">{formatDate(task.created_at)}</span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-actions">
        <button
          className="complete-button"
          onClick={handleComplete}
          disabled={isLoading}
          data-testid={`complete-button-${task.id}`}
        >
          {isLoading ? 'Processing...' : 'Done'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
