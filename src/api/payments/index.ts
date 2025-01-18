import { Payment } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { ErrorHandler } from '@/types';
import { anyStatusCode } from '@/utils/http';
import {
  catchError,
  defaultErrorHandler,
  getErrorMessage,
} from '@/utils/error';

// TODO:
// Update return type to include Zod errors.
export async function savePayment(
  paymentData: FormData,
  errorHandler: ErrorHandler = defaultErrorHandler,
): Promise<Payment | null> {
  const [error, response] = await catchError(
    fetch('/api/payments', {
      method: 'POST',
      body: paymentData,
    }),
  );

  if (error) {
    errorHandler(`Failed to save payment.`, getErrorMessage(error));

    return null;
  }

  if (
    !anyStatusCode(response.status, StatusCodes.OK, StatusCodes.BAD_REQUEST)
  ) {
    errorHandler(
      `Call to /api/payments returned an unsupported status code: ${response.status}.`,
    );

    return null;
  }

  // TODO:
  // Update catchError generic type to include Zod errors.
  const [jsonError, jsonData] = await catchError<Payment>(response.json());

  if (jsonError) {
    errorHandler(
      `Failed to read JSON after saving payment.`,
      getErrorMessage(jsonError),
    );

    return null;
  }

  return jsonData;
}
