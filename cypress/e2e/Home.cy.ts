describe('template spec', () => {
  it('shows Hello World!', () => {
    cy.visit('/');
    cy.get('main').contains('Hello World!');
  });
});
