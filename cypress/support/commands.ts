/// <reference types="cypress" />
import type { Session } from '@prisma/client';

import { SESSION_ID_COOKIE_NAME } from '@/utils/constants';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', () => {
  cy.task('session:create').then((session: Session) => {
    cy.setCookie(SESSION_ID_COOKIE_NAME, session.sessionId);
  });
});

Cypress.Commands.add('byTestId', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      byTestId(testId: string): Chainable<void>;
    }
  }
}

export {};
