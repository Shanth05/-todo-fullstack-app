import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';
import { Task } from '../../types/Task';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    created_at: '2023-12-01T10:00:00Z',
    updated_at: '2023-12-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    completed: false,
    created_at: '2023-12-02T10:00:00Z',
    updated_at: '2023-12-02T10:00:00Z',
  },
];

describe('TaskList', () => {
  const mockOnCompleteTask = jest.fn();

  beforeEach(() => {
    mockOnCompleteTask.mockClear();
  });

  it('renders tasks correctly', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnCompleteTask}
      />
    );
    
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    expect(screen.getByText('2 tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('renders singular task count', () => {
    const singleTask = [mockTasks[0]];
    render(
      <TaskList
        tasks={singleTask}
        onCompleteTask={mockOnCompleteTask}
      />
    );
    
    expect(screen.getByText('1 task')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <TaskList
        tasks={[]}
        onCompleteTask={mockOnCompleteTask}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onCompleteTask={mockOnCompleteTask}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started!')).toBeInTheDocument();
  });

  it('passes completing task ID to individual cards', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onCompleteTask={mockOnCompleteTask}
        completingTaskId={1}
      />
    );
    
    // The TaskCard component should receive isLoading=true for task with id 1
    const task1Button = screen.getByTestId('complete-button-1');
    const task2Button = screen.getByTestId('complete-button-2');
    
    expect(task1Button).toBeDisabled();
    expect(task1Button).toHaveTextContent('Processing...');
    expect(task2Button).not.toBeDisabled();
    expect(task2Button).toHaveTextContent('Done');
  });
});
