import { NextResponse } from 'next/server';

import prisma from '@/PrismaClient';
import authMiddleware from '@/middlewares/auth';
import { getErrorMessage } from '@/utils/error';
import { formDataToObject } from '@/utils/formData';
import PaymentSchema from '@/validation/schemas/PaymentSchema';

export const POST = authMiddleware(async (request, session) => {
  const paymentData = formDataToObject(await request.formData());
  const parsedPayment = PaymentSchema.safeParse(paymentData);

  if (parsedPayment.error) {
    return NextResponse.json(parsedPayment.error, { status: 400 });
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        name: parsedPayment.data?.name!,
        amount: parsedPayment.data?.amount!,
        userId: session.user.id,
      },
    });

    return NextResponse.json(payment);
  } catch (e) {
    return new NextResponse(getErrorMessage(e), { status: 500 });
  }
});
