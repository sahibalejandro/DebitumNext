import { redirect } from 'next/navigation';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import Session from '@/Session';
import type { RequestContext } from '@/RequestContext';
import { NextContext, PropsOrNextRequest } from '@/types';
import { deleteCSRFTokenCookieFromResponse } from '@/utils/auth';

export async function authenticationRequired(
  propsOrNextRequest: PropsOrNextRequest,
  _nextContext: NextContext,
  requestContext: RequestContext,
) {
  requestContext.session = await Session.get();

  if (requestContext.session) {
    return;
  }

  if (propsOrNextRequest instanceof NextRequest) {
    const response = new NextResponse('Unauthorized', {
      status: StatusCodes.UNAUTHORIZED,
    });
    deleteCSRFTokenCookieFromResponse(response);

    return response;
  }

  redirect('/');
}
