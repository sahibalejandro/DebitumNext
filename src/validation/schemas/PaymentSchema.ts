import { z } from 'zod';

const PaymentSchema = z.object({
  name: z.string().trim(),
  amount: z.coerce.number().min(0, 'Amount cannot be less than 0.'),
});

export default PaymentSchema;
