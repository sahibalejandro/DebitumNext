import crypto from 'node:crypto';
import type { User, Session } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { OAuth2UserInfo } from './types';
import { catchError, getErrorMessage } from './utils/error';

const prisma = new PrismaClient();

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

  private createSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  async createSession(): Promise<Pick<Session, 'session_id'>> {
    const [error, session] = await catchError(
      prisma.session.create({
        data: {
          user_id: this.user.id,
          session_id: this.createSessionId(),
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
