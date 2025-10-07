import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../TaskCard';
import { Task } from '../../types/Task';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  created_at: '2023-12-01T10:00:00Z',
  updated_at: '2023-12-01T10:00:00Z',
};

describe('TaskCard', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    expect(screen.getByTestId(`task-card-${mockTask.id}`)).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId(`complete-button-${mockTask.id}`)).toBeInTheDocument();
  });

  it('renders task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: '' };
    render(<TaskCard task={taskWithoutDescription} onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId(`complete-button-${mockTask.id}`);
    await user.click(completeButton);
    
    expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('disables button when loading', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} isLoading={true} />);
    
    const completeButton = screen.getByTestId(`complete-button-${mockTask.id}`);
    expect(completeButton).toBeDisabled();
    expect(completeButton).toHaveTextContent('Processing...');
  });

  it('formats date correctly', () => {
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    // The exact format may vary based on locale, but should contain the date
    const dateElement = screen.getByText(/Dec 1, 2023/);
    expect(dateElement).toBeInTheDocument();
  });
});
