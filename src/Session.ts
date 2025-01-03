import { User } from '@prisma/client';
import { cookies } from 'next/headers';

import prisma from '@/PrismaClient';
import { SESSION_ID_COOKIE_NAME } from './utils/constants';
import { catchError, getErrorMessage } from './utils/error';

export default class Session {
  id: string;
  user: Pick<User, 'name' | 'picture'>;

  static async get(): Promise<Session | null> {
    const sessionId = cookies().get(SESSION_ID_COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const [sessionError, session] = await catchError(
      prisma.session.findUnique({
        include: { user: { select: { name: true, picture: true } } },
        where: { session_id: sessionId },
      }),
    );

    if (sessionError) {
      console.error(
        `Failed to get session ${sessionId}: ${getErrorMessage(sessionError)}`,
      );

      return null;
    }

    if (!session?.user) {
      console.warn(`Session ${sessionId} not found.`);

      return null;
    }

    return new this(sessionId, session.user);
  }

  constructor(id: string, user: Session['user']) {
    this.id = id;
    this.user = user;
  }
}
