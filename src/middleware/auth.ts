import { redirect } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';

import Session from '@/Session';
import type { RequestContext } from '@/RequestContext';
import { deleteCSRFTokenCookieFromResponse } from '@/utils/auth';

export async function authRouteMiddleware(
  _request: NextRequest,
  requestContext: RequestContext,
) {
  requestContext.session = await Session.get();

  if (!requestContext.session) {
    const response = new NextResponse('Unauthorized', { status: 401 });
    deleteCSRFTokenCookieFromResponse(response);

    return response;
  }
}

export async function authPageMiddleware(
  _props: Record<string, unknown>,
  requestContext: RequestContext,
) {
  requestContext.session = await Session.get();

  if (!requestContext.session) {
    redirect('/');
  }
}
