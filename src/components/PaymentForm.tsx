'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { savePayment } from '@/api/payments';

export default function PaymentForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    // TODO:
    // Validate if jsonData contains Zod errors.
    const jsonData = await savePayment(
      new FormData(e.target as HTMLFormElement),
    );

    if (jsonData?.slugId) {
      return router.push(`/payments/${jsonData.slugId}`);
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" data-testid="input-payment-name" />
      <input
        min="0"
        step="0.01"
        name="amount"
        type="number"
        data-testid="input-payment-amount"
      />
      <button type="submit" data-testid="button-payment-save" disabled={saving}>
        Save
      </button>
    </form>
  );
}
