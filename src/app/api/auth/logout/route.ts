import { NextResponse } from 'next/server';

import Session from '@/Session';
import prisma from '@/PrismaClient';
import { catchError } from '@/utils/error';
import { SESSION_ID_COOKIE_NAME } from '@/utils/constants';

export async function GET() {
  // Delete the session record from the database if it exists.
  const session = await Session.get();

  if (session) {
    const [deleteSessionError] = await catchError(
      prisma.session.delete({
        where: {
          session_id: session.id,
        },
      }),
    );

    if (deleteSessionError) {
      console.error(`Failed to delete session ${session.id}`);
    }
  }

  // Create the redirect response and delete the cookie that keeps
  // the session id.
  const response = new NextResponse('', {
    status: 303,
    headers: {
      location: '/',
    },
  });

  response.cookies.delete(SESSION_ID_COOKIE_NAME);

  return response;
}
