import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/PrismaClient';
import { onlyAuthenticated } from '@/utils/auth';

export async function POST(request: NextRequest) {
  return await onlyAuthenticated(request, async (request, session) => {
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
}
