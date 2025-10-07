import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('validates required title field', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);
    
    expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates title length', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const longTitle = 'a'.repeat(256);
    
    await user.type(titleInput, longTitle);
    await user.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('title-error')).toHaveTextContent('Title must be less than 255 characters');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const longDescription = 'a'.repeat(1001);
    
    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, longDescription);
    await user.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('description-error')).toHaveTextContent('Description must be less than 1000 characters');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(screen.getByTestId('submit-button'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
    });
  });

  it('submits form with only title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    
    await user.type(titleInput, 'Test Task');
    await user.click(screen.getByTestId('submit-button'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: '',
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('disables submit button when loading', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Creating...');
  });

  it('disables submit button when title is empty', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Trigger validation error
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByTestId('title-error')).toBeInTheDocument();
    
    // Start typing in title field
    const titleInput = screen.getByTestId('title-input');
    await user.type(titleInput, 'a');
    
    expect(screen.queryByTestId('title-error')).not.toBeInTheDocument();
  });
});
