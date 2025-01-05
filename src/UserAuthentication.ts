import type { User, Session as SessionModel } from '@prisma/client';

import Session from './Session';
import prisma from '@/PrismaClient';
import { OAuth2UserInfo } from './types';
import { catchError, getErrorMessage } from './utils/error';

export default class UserAuthentication {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  static async register(userInfo: OAuth2UserInfo): Promise<UserAuthentication> {
    const [error, user] = await catchError(
      prisma.user.upsert({
        where: {
          email: userInfo.email,
        },
        update: {
          name: userInfo.name,
          picture: userInfo.picture,
        },
        create: {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        },
      }),
    );

    if (error) {
      console.error(
        `Failed to register user ${userInfo.email}`,
        getErrorMessage(error),
      );
      throw error;
    }

    return new this(user);
  }

  async createSession(): Promise<Pick<SessionModel, 'sessionId'>> {
    const [error, session] = await catchError(
      prisma.session.create({
        data: {
          userId: this.user.id,
          sessionId: Session.createSessionId(),
        },
      }),
    );

    if (error) {
      console.error(
        `Failed to create session for ${this.user.email}`,
        getErrorMessage(error),
      );
      throw error;
    }

    return session;
  }
}
