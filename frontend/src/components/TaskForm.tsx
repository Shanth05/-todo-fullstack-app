import React, { useState } from 'react';
import { CreateTaskRequest } from '../types/Task';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskRequest) => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
    });
    setErrors({});
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} data-testid="task-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="Enter task title..."
          disabled={isLoading}
          data-testid="title-input"
        />
        {errors.title && (
          <span className="error-message" data-testid="title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Enter task description (optional)..."
          rows={3}
          disabled={isLoading}
          data-testid="description-input"
        />
        {errors.description && (
          <span className="error-message" data-testid="description-error">
            {errors.description}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading || !formData.title.trim()}
        data-testid="submit-button"
      >
        {isLoading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
