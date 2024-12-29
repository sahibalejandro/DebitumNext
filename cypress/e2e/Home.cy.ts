describe('Home Page', () => {
  it('shows welcome page', () => {
    cy.visit('/');
    cy.get('main').contains('Welcome!');
  });

  it('shows dashboard', () => {
    cy.visit('/');
    cy.get('main').contains('Dashboard!');
  });
});
