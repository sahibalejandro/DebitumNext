import Example from '@/components/Example';

describe('Example.cy.tsx', () => {
  it('shows hello world', () => {
    cy.mount(<Example />);
    cy.get('div').contains('hello world');
  });
});
