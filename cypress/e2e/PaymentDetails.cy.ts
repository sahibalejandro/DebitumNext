describe('Payment Details', () => {
  it('redirects no authenticated users to home page', () => {
    cy.visit('/payments/96f00ab6-8eb1-4cdb-8429-5c5ca17b4bd7');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
