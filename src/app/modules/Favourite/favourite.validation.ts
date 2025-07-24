import { z } from "zod";
import { Types } from "mongoose";

export const addOrRemoveFavouriteSchema = z.object({
  productId: z
    .string({
      required_error: "productId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "productId must be a valid ObjectId",
    }),
});
