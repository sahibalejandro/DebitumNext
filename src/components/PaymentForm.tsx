'use client';
import { useState } from 'react';
import type { Payment } from '@prisma/client';

import { catchError, getErrorMessage } from '@/utils/error';

async function savePayment(paymentData: FormData): Promise<Payment | null> {
  const [error, response] = await catchError(
    fetch('/api/payments', {
      method: 'POST',
      body: paymentData,
    }),
  );

  if (error) {
    console.error(`Failed to save payment.`, getErrorMessage(error));

    return null;
  }

  const [jsonError, payment] = await catchError<Payment>(response.json());

  if (jsonError) {
    console.error(
      `Failed to read JSON after saving payment.`,
      getErrorMessage(jsonError),
    );

    return null;
  }

  return payment;
}

export default function PaymentForm() {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await savePayment(new FormData(e.target as HTMLFormElement));
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" data-testid="input-payment-name" />
      <input
        type="number"
        name="amount"
        step="0.01"
        min="0"
        data-testid="input-payment-amount"
      />
      <button type="submit" data-testid="button-payment-save" disabled={saving}>
        Save
      </button>
    </form>
  );
}
