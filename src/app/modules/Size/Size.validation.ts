import { z } from "zod";


export const sizeValidationSchema = z.object({
    size: z.string({
        invalid_type_error: "Size must be a valid string value.",
        required_error: "size is required",
    })
        .refine((val) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(val), {
            message: "Size must be one of: XS, S, M, L, XL, XXL.",
        }),
});