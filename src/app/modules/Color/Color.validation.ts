import { z } from 'zod';
import { categoryRegex } from '../Category/Category.validation';

export const createColorValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "name must be string",
      required_error: "name is required",
    })
    .min(1, "name is required")
    .trim()
    .regex(/^[A-Za-z\s]+$/, {
      message: "name must only contain letters and spaces",
    }),
  hexCode: z
    .string({
      required_error: "Hex code is required",
      invalid_type_error: "Hex code must be a string",
    })
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Hex code must be a valid color format (e.g., #fff or #ffffff)",
    }),
});

export const updateColorValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "name must be string",
      required_error: "name is required",
    })
    .min(1, "name is required")
    .regex(
      categoryRegex,
      "name only contain letters and valid symbols (' . - & , ( )) are allowed."
    )
    .trim().optional(),
  hexCode: z
    .string({
      required_error: "Hex code is required",
      invalid_type_error: "Hex code must be a string",
    })
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Hex code must be a valid color format (e.g., #fff or #ffffff)",
    }).optional(),
});
