// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to wait for the app to be ready
 */
Cypress.Commands.add('waitForAppReady', () => {
  cy.get('[data-testid="task-form"]').should('be.visible');
});

/**
 * Custom command to create a task
 */
Cypress.Commands.add('createTask', (title, description = '') => {
  cy.get('[data-testid="title-input"]').type(title);
  if (description) {
    cy.get('[data-testid="description-input"]').type(description);
  }
  cy.get('[data-testid="submit-button"]').click();
});

/**
 * Custom command to complete a task by title
 */
Cypress.Commands.add('completeTaskByTitle', (title) => {
  cy.contains(title).parent().find('[data-testid^="complete-button-"]').click();
});

/**
 * Custom command to clear all tasks
 */
Cypress.Commands.add('clearAllTasks', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid^="complete-button-"]').length > 0) {
      cy.get('[data-testid^="complete-button-"]').each(($button) => {
        cy.wrap($button).click();
      });
    }
  });
});

/**
 * Custom command to wait for API calls to complete
 */
Cypress.Commands.add('waitForApiCalls', () => {
  // Wait for any pending network requests to complete
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      const checkPending = () => {
        if (win.fetch && win.fetch.pendingRequests === 0) {
          resolve();
        } else {
          setTimeout(checkPending, 100);
        }
      };
      checkPending();
    });
  });
});
