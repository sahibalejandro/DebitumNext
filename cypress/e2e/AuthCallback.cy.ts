import { AUTH_CSRF_TOKEN_COOKIE_NAME } from '@/utils/constants';

describe('Auth Callback', () => {
  it('shows OAuth2 authentication error', () => {
    cy.request({
      url: '/api/auth/callback?error=some-oauth2-error',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.eq('OAuth2 error: some-oauth2-error');
    });
  });

  it('shows error message when OAuth2 code is missing', () => {
    cy.request({ url: '/api/auth/callback', failOnStatusCode: false }).then(
      (response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.eq('OAuth2 Code is missing.');
      },
    );
  });

  it('shows error if the CSRF token is invalid', () => {
    cy.request({
      url: '/api/auth/callback?code=code',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.eq('Invalid CSRF Token.');
    });
  });

  it('validates CSRF token and removes it from the response', () => {
    cy.setCookie(AUTH_CSRF_TOKEN_COOKIE_NAME, 'csrf-token');
    cy.request({
      url: '/api/auth/callback?state=csrf-token&code=code&test=true',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq('CSRF Token is valid.');
      cy.getCookie(AUTH_CSRF_TOKEN_COOKIE_NAME).should('be.null');
    });
  });
});
