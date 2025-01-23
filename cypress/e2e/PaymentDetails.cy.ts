describe('Payment Details', () => {
  const NONEXISTENT_PAYMENT_ID = '96f00ab6-8eb1-4cdb-8429-5c5ca17b4bd7';

  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:clean');
  });

  it('redirects no authenticated users to home page', () => {
    cy.visit(`/payments/${NONEXISTENT_PAYMENT_ID}`);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('shows Not Found page if payment is not found', () => {
    cy.on(
      'uncaught:exception',
      (err) => !err.message.includes('NEXT_NOT_FOUND'),
    );

    cy.login();

    const url = `/payments/${NONEXISTENT_PAYMENT_ID}`;

    cy.request({
      url,
      failOnStatusCode: false,
    })
      .its('status')
      .should('equal', 404);

    cy.visit(url, { failOnStatusCode: false });
    cy.contains('Not Found!');
  });
});
