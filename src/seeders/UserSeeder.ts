import { User } from '@prisma/client';

import prisma from '../PrismaClient';

export default class UserSeeder {
  testUser: Pick<User, 'name' | 'email' | 'picture'> = {
    name: 'Test User',
    email: 'test.user@debitum.sahib.dev',
    picture: 'https://picsum.photos/seed/debitum/100/100',
  };

  async seed() {
    await this.createTestUser();
  }

  async clean() {
    return await prisma.user.delete({
      where: { email: this.testUser.email },
    });
  }

  async createTestUser() {
    return await prisma.user.upsert({
      where: { email: this.testUser.email },
      create: this.testUser,
      update: {},
    });
  }
}
