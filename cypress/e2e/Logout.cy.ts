import { SESSION_ID_COOKIE_NAME } from '@/utils/constants';

describe('Logout', () => {
  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:clean');
  });

  it('logs out', () => {
    cy.login();
    cy.visit('/');

    cy.getCookie(SESSION_ID_COOKIE_NAME).should('exist');

    cy.byTestId('user-menu').byTestId('link-logout').click();

    cy.getCookie(SESSION_ID_COOKIE_NAME).should('not.exist');
  });
});
