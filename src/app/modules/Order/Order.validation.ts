import { z } from 'zod';

export const updateOrderValidationSchema = z.object({
  status: z.string({
    invalid_type_error: "status must be a valid string value.",
  })
    .refine((val) => ['processing', 'shipped', 'delivered', 'cancelled'].includes(val), {
      message: "status must be one of: 'processing', 'shipped', 'delivered', 'cancelled'",
    }).optional(),
  paymentStatus: z.string({
    invalid_type_error: "status must be a valid string value.",
  })
    .refine((val) => ['paid', 'failled'].includes(val), {
      message: "status must be one of: 'paid', 'shipped', 'failled'",
    }).optional(),
});
