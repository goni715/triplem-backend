import { z } from 'zod';

export const createContactValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  phone: z
    .string({
      invalid_type_error: "phone must be string",
      required_error: "phone is required",
    })
    .trim()
    .min(1, "phone is required"),
  message: z
    .string({
      invalid_type_error: "message must be string",
      required_error: "message is required",
    })
    .trim()
    .min(1, "message is required")
});

export const updateContactValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
