describe('Dashboard', () => {
  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:clean');
  });

  beforeEach(() => {
    cy.login();
  });

  it('shows upcoming payments', () => {
    cy.visit('/');
    cy.contains('Upcoming Payments');
  });
});
