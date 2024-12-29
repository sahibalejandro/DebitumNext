import { NextRequest, NextResponse } from 'next/server';

import { catchError } from '@/utils/error';
import {
  getUserInfo,
  getAccessToken,
  requestHasValidCSRFToken,
  deleteCSRFTokenCookieFromResponse,
} from '@/utils/auth';

function makeResponse(body: string, status: number) {
  const response = new NextResponse(body, { status });
  deleteCSRFTokenCookieFromResponse(response);

  return response;
}

export async function GET(request: NextRequest) {
  // --------------------------------------------------------------------------
  // In this section we validate the current request contains all the necessary
  // information to proceed with the Access Token exchange.
  const url = new URL(request.url);

  if (url.searchParams.has('error')) {
    return makeResponse(
      'Authentication from OAuth2 Service returned the followgin error: ' +
        url.searchParams.get('error'),
      401,
    );
  }

  if (!url.searchParams.has('code')) {
    return makeResponse('OAuth2 Code is missing.', 400);
  }

  if (!requestHasValidCSRFToken(request)) {
    return makeResponse('Invalid CSRF Token.', 400);
  }

  // --------------------------------------------------------------------------
  // In this section we try to exchange the given Code for an Access Token.
  // This is necessary to access the User Info within the Access Token.

  const [accessTokenError, accessToken] = await catchError(
    getAccessToken(url.searchParams.get('code')!),
  );

  if (accessTokenError) {
    return makeResponse(accessTokenError.message, 401);
  }

  if (!accessToken?.id_token) {
    return makeResponse(`OAuth2 Service did not provide an access token.`, 401);
  }

  // --------------------------------------------------------------------------
  // In this section we extract the User Info from the ID Token that comes
  // within the Access Token, the User Info is used to create the user
  // in DB (if not created yet) and start the user session.

  const userInfo = getUserInfo(accessToken.id_token);

  if (!userInfo) {
    return makeResponse('Failed to get user info.', 401);
  }

  return makeResponse(`Welcome ${userInfo.name}!`, 200);
}
