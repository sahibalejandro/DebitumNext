import { type NextRequest, NextResponse } from 'next/server';

import Session from '@/Session';
import AccessTokenError from '@/AccessTokenError';
import { catchError, getErrorMessage } from './error';
import { AUTH_CSRF_TOKEN_COOKIE_NAME } from './constants';
import { OAuth2TokenExchangeResponse, OAuth2UserInfo } from '@/types';

const REDIRECT_URI = `${process.env.APP_URL}/api/auth/callback`;

export function generateCSRFToken() {
  return crypto.randomUUID();
}

export function addCSRFTokenCookieToResponse(
  res: NextResponse,
  csrfToken: string,
) {
  res.cookies.set({
    httpOnly: true,
    value: csrfToken,
    name: AUTH_CSRF_TOKEN_COOKIE_NAME,
  });
}

export function requestHasValidCSRFToken(req: NextRequest) {
  return (
    new URL(req.url).searchParams.get('state') ===
    req.cookies.get(AUTH_CSRF_TOKEN_COOKIE_NAME)?.value
  );
}

export function deleteCSRFTokenCookieFromResponse(res: NextResponse) {
  res.cookies.delete(AUTH_CSRF_TOKEN_COOKIE_NAME);
}

export function generateOAuthURL(csrfToken: string) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  url.searchParams.set('state', csrfToken);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID ?? '');

  return url.toString();
}

export async function getAccessToken(
  code: string,
): Promise<OAuth2TokenExchangeResponse> {
  const body = new FormData();

  body.set('code', code);
  body.set('redirect_uri', REDIRECT_URI);
  body.set('grant_type', 'authorization_code');
  body.set('client_id', process.env.GOOGLE_CLIENT_ID ?? '');
  body.set('client_secret', process.env.GOOGLE_CLIENT_SECRET ?? '');

  const [error, response] = await catchError(
    fetch('https://oauth2.googleapis.com/token', { method: 'POST', body }),
  );

  return new Promise(async (resolve, reject) => {
    if (error) {
      reject(error);
    } else if (response) {
      const data = await response.json();

      if (response.ok) {
        resolve(data);
      } else {
        const error = new AccessTokenError(
          `Error from OAuth2 service: ${data.error_description ?? 'Unknow error while getting access token.'}`,
        );
        error.statusCode = response.status;
        reject(error);
      }
    } else {
      reject(
        new Error(
          'Request to get access token did not generate an error nor a response.',
        ),
      );
    }
  });
}

export function getUserInfo(tokenId: string): OAuth2UserInfo | undefined {
  const [, payload] = tokenId.split('.');

  const json = Buffer.from(payload, 'base64').toString();

  try {
    const userInfo: OAuth2UserInfo = JSON.parse(json);

    return userInfo;
  } catch (e) {
    console.error(
      `Failed to get user info from token ID: ${getErrorMessage(e)}`,
    );
  }
}

export async function onlyAuthenticated(
  request: NextRequest,
  fn: (
    request: NextRequest,
    session: Session,
  ) => Promise<NextResponse> | NextResponse,
) {
  const session = await Session.get();

  if (!session) {
    const response = new NextResponse('Unauthorized', { status: 401 });
    deleteCSRFTokenCookieFromResponse(response);
    return response;
  }

  return fn(request, session);
}
