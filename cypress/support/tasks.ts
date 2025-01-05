import Session from '../../src/Session';
import prisma from '../../src/PrismaClient';
import UserSeeder from '../../src/seeders/UserSeeder';

export default {
  db: {
    async seed() {
      await new UserSeeder().seed();

      return null;
    },

    async clean() {
      await new UserSeeder().clean();

      return null;
    },
  },

  session: {
    async create() {
      const user = await new UserSeeder().createTestUser();

      return await prisma.session.create({
        data: {
          userId: user.id,
          sessionId: Session.createSessionId(),
        },
      });
    },
  },
};
