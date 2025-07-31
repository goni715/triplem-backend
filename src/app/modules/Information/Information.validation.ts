import { z } from 'zod';

export const createInformationValidationSchema = z.object({
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
  address: z
    .string({
      invalid_type_error: "address must be string",
      required_error: "address is required",
    })
    .trim()
    .min(1, "address is required"),
  instagram: z
    .string({
      invalid_type_error: "instagram must be a valid URL",
      required_error: "instagram is required"
    })
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "instagram must be a valid URL",
    }),
  teligram: z
     .string({
      invalid_type_error: "teligram must be a valid URL",
      required_error: "teligram is required"
    })
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "teligram must be a valid URL",
    })
});

