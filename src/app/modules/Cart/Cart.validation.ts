import { z } from 'zod';
import { Types } from "mongoose";

export const createCartValidationSchema = z.object({
  productId: z
    .string({
      invalid_type_error: "productId must be a valid ObjectId",
      required_error: "productId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "productId must be a valid ObjectId",
    }),
  price: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "price is required",
          invalid_type_error: "price must be a number",
        })
        .refine((val) => !isNaN(val), { message: "price must be a valid number" })
        .refine((val) => val > 0, { message: "price must be greater than 0" })
    )
  ,
  quantity: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z
        .number({
          required_error: "quantity is required",
          invalid_type_error: "quantity must be a number",
        })
        .refine((val) => !isNaN(val), { message: "quantity must be a valid number" })
        .refine((val) => val > 0, { message: "quantity must be greater than 0" })
    )
  ,
  image: z
    .string({
      invalid_type_error: "image must be string value",
      required_error: "image is required"
    })
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "image must be a valid URL",
    })
    ,
  colorId: z
    .string({
      invalid_type_error: "colorId must be a valid ObjectId",
      required_error: "colorId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "colorId must be a valid ObjectId",
    }).optional(),
  sizeId: z
    .string({
      invalid_type_error: "sizeId must be a valid ObjectId",
      required_error: "sizeId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "sizeId must be a valid ObjectId",
    }).optional(),
});

export const updateCartValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
