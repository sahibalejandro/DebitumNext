import { SESSION_ID_COOKIE_NAME } from '@/utils/constants';
import { NextResponse } from 'next/server';

export async function GET() {
  const response = new NextResponse('', {
    status: 303,
    headers: {
      location: '/',
    },
  });

  response.cookies.delete(SESSION_ID_COOKIE_NAME);

  return response;
}
