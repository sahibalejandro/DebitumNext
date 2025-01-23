import { notFound } from 'next/navigation';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/PrismaClient';
import { RequestContext } from '@/RequestContext';
import { NextContext, PropsOrNextRequest } from '@/types';

export async function userOwnsPayment(
  propsOrNextRequest: PropsOrNextRequest,
  nextContext: NextContext,
  requestContext: RequestContext,
) {
  const count = await prisma.payment.count({
    where: {
      slugId: nextContext?.params.slugId,
      userId: requestContext.session?.user.id,
    },
  });

  if (count > 0) {
    return;
  }

  if (propsOrNextRequest instanceof NextRequest) {
    return new NextResponse('Not Found', { status: StatusCodes.NOT_FOUND });
  }

  notFound();
}
