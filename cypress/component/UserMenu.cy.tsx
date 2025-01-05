import Session from '@/Session';
import UserMenu from '@/components/UserMenu';

describe('<UserMenu />', () => {
  it('shows Login link for unauthenticated users', () => {
    cy.mount(<UserMenu user={undefined} />);
    cy.get('[data-testid="link-login"]').contains('Login');
  });

  it('shows user name and logout link for authenticated users', () => {
    const testUser: Session['user'] = {
      name: 'Test User',
      picture: 'https://picsum.photos/seed/debitum/100/100',
    };

    cy.mount(<UserMenu user={testUser} />);
    cy.get('[data-testid="user-name"]').contains(testUser.name);
    cy.get('[data-testid="link-logout"]').contains('Logout');
  });
});
