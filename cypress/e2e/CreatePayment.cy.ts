describe('Create Payment', () => {
  before(() => {
    cy.task('db:seed');
    cy.login();
  });

  after(() => {
    cy.task('db:clean');
  });

  it('opens the Payment Form and creates a new payment', () => {
    cy.visit('/');
    cy.byTestId('link-create-payment').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/payments/create');
    cy.byTestId('input-payment-name').type('Payment Name');
    cy.byTestId('input-payment-amount').type('2500');
    cy.byTestId('button-payment-save').click();
  });
});
