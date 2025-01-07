import { NextResponse } from 'next/server';

import prisma from '@/PrismaClient';
import authMiddleware from '@/middlewares/auth';

export const POST = authMiddleware(async (request, session) => {
  // TODO:
  // Validate and format input data before saving into database.
  const formData = await request.formData();
  const payment = await prisma.payment.create({
    data: {
      name: formData.get('name') ?? 'No name',
      amount: parseInt(formData.get('amount')) ?? 0,
      userId: session.user.id,
    },
  });

  return NextResponse.json(payment);
});
