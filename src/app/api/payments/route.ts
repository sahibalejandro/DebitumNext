import { StatusCodes } from 'http-status-codes';
import { type NextRequest, NextResponse } from 'next/server';

import prisma from '@/PrismaClient';
import { applyMiddlewares } from '@/middleware';
import { getErrorMessage } from '@/utils/error';
import { formDataToObject } from '@/utils/formData';
import { authenticationRequired } from '@/middleware/auth';
import PaymentSchema from '@/validation/schemas/PaymentSchema';

export const POST = applyMiddlewares(
  authenticationRequired,
  async (request, _nextContext, requestContext) => {
    const paymentData = formDataToObject(
      await (request as NextRequest).formData(),
    );
    const parsedPayment = PaymentSchema.safeParse(paymentData);

    if (parsedPayment.error) {
      return NextResponse.json(parsedPayment.error, {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    try {
      const payment = await prisma.payment.create({
        data: {
          name: parsedPayment.data.name,
          amount: parsedPayment.data.amount,
          // TODO:
          // Check for requestContext.session before reading it.
          userId: requestContext.session?.user.id,
        },
      });

      return NextResponse.json(payment);
    } catch (e) {
      return new NextResponse(getErrorMessage(e), {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  },
);
