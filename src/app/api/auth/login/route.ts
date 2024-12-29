import { NextResponse } from 'next/server';

import {
  generateCSRFToken,
  generateOAuthURL,
  addCSRFTokenCookieToResponse,
} from '@/utils/auth';

export function GET() {
  const csrfToken = generateCSRFToken();
  const oAuthURL = generateOAuthURL(csrfToken);

  const response = new NextResponse('', {
    status: 303,
    headers: {
      Location: oAuthURL,
    },
  });

  addCSRFTokenCookieToResponse(response, csrfToken);

  return response;
}
