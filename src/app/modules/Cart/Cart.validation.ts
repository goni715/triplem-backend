import { z } from 'zod';
import { Types } from "mongoose";

export const createCartValidationSchema = z.object({
  productId: z
     .string({
       required_error: "productId is required!",
     })
     .refine((id) => Types.ObjectId.isValid(id), {
       message: "productId must be a valid ObjectId",
     }),
  description: z.string({
    required_error: "description is required !"
  }),
});

export const updateCartValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
