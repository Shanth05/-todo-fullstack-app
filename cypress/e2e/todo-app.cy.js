describe('Todo App E2E Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
  });

  it('should display the app title and form', () => {
    // Check if the main elements are visible
    cy.contains('Todo Task Manager').should('be.visible');
    cy.contains('Stay organized and get things done').should('be.visible');
    cy.get('[data-testid="task-form"]').should('be.visible');
    cy.get('[data-testid="title-input"]').should('be.visible');
    cy.get('[data-testid="description-input"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
  });

  it('should create a new task', () => {
    // Fill out the form
    cy.get('[data-testid="title-input"]').type('E2E Test Task');
    cy.get('[data-testid="description-input"]').type('This is a test task created by E2E tests');
    
    // Submit the form
    cy.get('[data-testid="submit-button"]').click();
    
    // Check if the task appears in the list
    cy.contains('E2E Test Task').should('be.visible');
    cy.contains('This is a test task created by E2E tests').should('be.visible');
    
    // Check if the form is reset
    cy.get('[data-testid="title-input"]').should('have.value', '');
    cy.get('[data-testid="description-input"]').should('have.value', '');
  });

  it('should validate required fields', () => {
    // Try to submit empty form
    cy.get('[data-testid="submit-button"]').should('be.disabled');
    
    // Try to submit with only spaces
    cy.get('[data-testid="title-input"]').type('   ');
    cy.get('[data-testid="submit-button"]').should('be.disabled');
    
    // Clear and try to submit
    cy.get('[data-testid="title-input"]').clear();
    cy.get('[data-testid="submit-button"]').click();
    
    // Check for validation error
    cy.get('[data-testid="title-error"]').should('be.visible');
    cy.contains('Title is required').should('be.visible');
  });

  it('should validate title length', () => {
    // Create a title that's too long
    const longTitle = 'a'.repeat(256);
    cy.get('[data-testid="title-input"]').type(longTitle);
    cy.get('[data-testid="submit-button"]').click();
    
    // Check for validation error
    cy.get('[data-testid="title-error"]').should('be.visible');
    cy.contains('Title must be less than 255 characters').should('be.visible');
  });

  it('should validate description length', () => {
    // Create a description that's too long
    const longDescription = 'a'.repeat(1001);
    cy.get('[data-testid="title-input"]').type('Valid Title');
    cy.get('[data-testid="description-input"]').type(longDescription);
    cy.get('[data-testid="submit-button"]').click();
    
    // Check for validation error
    cy.get('[data-testid="description-error"]').should('be.visible');
    cy.contains('Description must be less than 1000 characters').should('be.visible');
  });

  it('should complete a task', () => {
    // First create a task
    cy.get('[data-testid="title-input"]').type('Task to Complete');
    cy.get('[data-testid="description-input"]').type('This task will be completed');
    cy.get('[data-testid="submit-button"]').click();
    
    // Wait for the task to appear
    cy.contains('Task to Complete').should('be.visible');
    
    // Complete the task
    cy.get('[data-testid="complete-button-1"]').click();
    
    // Check that the task is removed from the list
    cy.contains('Task to Complete').should('not.exist');
  });

  it('should show loading states', () => {
    // Create a task and check loading state
    cy.get('[data-testid="title-input"]').type('Loading Test Task');
    cy.get('[data-testid="submit-button"]').click();
    
    // The button should show loading state briefly
    cy.get('[data-testid="submit-button"]').should('contain', 'Creating...');
    
    // Wait for the task to be created
    cy.contains('Loading Test Task').should('be.visible');
    
    // Complete the task and check loading state
    cy.get('[data-testid="complete-button-1"]').click();
    cy.get('[data-testid="complete-button-1"]').should('contain', 'Processing...');
  });

  it('should show empty state when no tasks', () => {
    // If there are existing tasks, complete them first
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid^="complete-button-"]').length > 0) {
        // Complete all existing tasks
        cy.get('[data-testid^="complete-button-"]').each(($button) => {
          cy.wrap($button).click();
        });
      }
    });
    
    // Check empty state
    cy.contains('No tasks yet').should('be.visible');
    cy.contains('Create your first task to get started!').should('be.visible');
  });

  it('should show task count correctly', () => {
    // Create multiple tasks
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    tasks.forEach((taskTitle, index) => {
      cy.get('[data-testid="title-input"]').type(taskTitle);
      cy.get('[data-testid="submit-button"]').click();
      cy.contains(`${index + 1} task`).should('be.visible');
    });
    
    // Check plural form
    cy.contains('3 tasks').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API calls and return error
    cy.intercept('POST', '/api/tasks', {
      statusCode: 500,
      body: { success: false, message: 'Server error' }
    }).as('createTaskError');
    
    // Try to create a task
    cy.get('[data-testid="title-input"]').type('Error Test Task');
    cy.get('[data-testid="submit-button"]').click();
    
    // Wait for the API call
    cy.wait('@createTaskError');
    
    // Check that error toast appears (if using toast notifications)
    // This would depend on your toast implementation
  });

  it('should be responsive on mobile', () => {
    // Set mobile viewport
    cy.viewport(375, 667);
    
    // Check that the app is still functional
    cy.get('[data-testid="task-form"]').should('be.visible');
    cy.get('[data-testid="title-input"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
    
    // Create a task on mobile
    cy.get('[data-testid="title-input"]').type('Mobile Test Task');
    cy.get('[data-testid="submit-button"]').click();
    
    // Check that the task appears
    cy.contains('Mobile Test Task').should('be.visible');
  });
});
