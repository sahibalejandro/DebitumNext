import { NextRequest } from 'next/server';

import { ONE_WEEK } from '@/utils/constants';
import UserAuthentication from '@/UserAuthentication';
import type AccessTokenError from '@/AccessTokenError';
import AuthCallbackResponse from '@/AuthCallbackResponse';
import { catchError, getErrorMessage } from '@/utils/error';
import {
  getUserInfo,
  getAccessToken,
  requestHasValidCSRFToken,
} from '@/utils/auth';

export async function GET(request: NextRequest) {
  /*
   * ---------------------------------------------------------------------------
   * Validate Request
   * ---------------------------------------------------------------------------
   *
   * In this section we validate the current request contains all the
   * necessary information to proceed with the Access Token exchange.
   */
  const url = new URL(request.url);

  if (url.searchParams.has('error')) {
    return new AuthCallbackResponse(
      'OAuth2 error: ' + url.searchParams.get('error'),
      { status: 401 },
    );
  }

  if (!url.searchParams.has('code')) {
    return new AuthCallbackResponse('OAuth2 Code is missing.', { status: 400 });
  }

  /*
   * ---------------------------------------------------------------------------
   * For Testing
   * ---------------------------------------------------------------------------
   *
   * When running E2E tests we have to check that the CSRF token can be
   * validated, we achieve this by setting the "test" flag on the
   * request, when this flag is resent and the CSRF is valid we
   * return a special response to indicate this tests passed.
   */
  if (!requestHasValidCSRFToken(request)) {
    return new AuthCallbackResponse('Invalid CSRF Token.', { status: 400 });
  } else if (url.searchParams.has('test')) {
    return new AuthCallbackResponse('CSRF Token is valid.');
  }

  /*
   * ---------------------------------------------------------------------------
   * Exchange Code for Access token
   * ---------------------------------------------------------------------------
   *
   * In this section we try to exchange the given Code for an Access Token.
   * This is necessary to access the User Info within the Access Token.
   */
  const [accessTokenError, accessToken] = await catchError(
    getAccessToken(url.searchParams.get('code')!),
  );

  if (accessTokenError) {
    return new AuthCallbackResponse(getErrorMessage(accessTokenError), {
      status: (accessTokenError as AccessTokenError).statusCode ?? 500,
    });
  }

  if (!accessToken?.id_token) {
    return new AuthCallbackResponse(
      `OAuth2 Service did not provide an access token.`,
      { status: 400 },
    );
  }

  /*
   * ---------------------------------------------------------------------------
   * Extract user data from the Token ID
   * ---------------------------------------------------------------------------
   *
   * In this section we extract the User Info from the ID Token that comes
   * within the Access Token, the User Info is used to create the user
   * in DB (if not created yet) and start the user session.
   */
  const userInfo = getUserInfo(accessToken.id_token);

  if (!userInfo) {
    return new AuthCallbackResponse('Failed to get user info.', {
      status: 500,
    });
  }

  /*
   * ---------------------------------------------------------------------------
   * Register user and create session
   * ---------------------------------------------------------------------------
   *
   * Register the user (create if not exists) and start the session. The session
   * ID is attached to the response as a cookie so we can authenticate the
   * user back again in future requests.
   */
  const [authError, auth] = await catchError(
    UserAuthentication.register(userInfo),
  );

  if (authError) {
    return new AuthCallbackResponse(`Failed to register user.`, {
      status: 500,
    });
  }

  const [sessionError, session] = await catchError(auth.createSession());

  if (sessionError) {
    return new AuthCallbackResponse(`Failed to create session.`, {
      status: 500,
    });
  }

  const response = new AuthCallbackResponse(`Welcome ${userInfo.name}!`, {
    status: 200,
  });

  response.cookies.set('session_id', session.session_id, {
    httpOnly: true,
    maxAge: ONE_WEEK / 1000,
  });

  return response;
}
