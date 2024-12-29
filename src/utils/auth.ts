import { NextRequest, NextResponse } from 'next/server';

import { catchError, getErrorMessage } from './error';
import { OAuth2TokenExchangeResponse, OAuth2UserInfo } from '@/types';

const OAUTH_CSRF_TOKEN_COOKIE = 'debitum_oauth_csrf_token';
const REDIRECT_URI = `${process.env.APP_URL}/api/auth/callback`;

export function generateCSRFToken() {
  return crypto.randomUUID();
}

export function addCSRFTokenCookieToResponse(
  res: NextResponse,
  csrfToken: string,
) {
  res.cookies.set({
    name: OAUTH_CSRF_TOKEN_COOKIE,
    value: csrfToken,
    httpOnly: true,
  });
}

export function requestHasValidCSRFToken(req: NextRequest) {
  return (
    new URL(req.url).searchParams.get('state') ===
    req.cookies.get(OAUTH_CSRF_TOKEN_COOKIE)?.value
  );
}

export function deleteCSRFTokenCookieFromResponse(res: NextResponse) {
  res.cookies.delete(OAUTH_CSRF_TOKEN_COOKIE);
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
        reject(
          new Error(
            `Error from OAuth2 service: ${data.error_description ?? 'Unknow error while getting access token.'}`,
          ),
        );
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
