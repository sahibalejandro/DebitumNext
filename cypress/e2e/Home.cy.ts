describe('Home Page', () => {
  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:clean');
  });

  it('shows welcome page to no authenticated users', () => {
    cy.visit('/');
    cy.get('main').contains('Welcome!');
  });

  it('shows dashboard to authenticated users', () => {
    cy.login();
    cy.visit('/');
    cy.get('main').contains('Dashboard!');
  });
});
