import { z } from "zod";
export const categoryRegex = /^[A-Za-z\s'.\-&,()]+$/;


export const categoryValidationSchema = z.object({
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
        .trim(),
});