import { type NextRequest, NextResponse } from 'next/server';

import Session from '@/Session';
import { deleteCSRFTokenCookieFromResponse } from '@/utils/auth';

export default function onlyAuthenticated(
  handler: (request: NextRequest, session: Session) => Promise<NextResponse>,
) {
  return async function (request: NextRequest) {
    const session = await Session.get();

    if (!session) {
      const response = new NextResponse('Unauthorized', { status: 401 });
      deleteCSRFTokenCookieFromResponse(response);
      return response;
    }

    return await handler(request, session);
  };
}
