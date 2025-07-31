import { z } from "zod";
import { VALID_ACCESS_VALUES } from "./admin.constant";
import { fullNameRegex } from "../User/user.validation";


export const createAdminValidationSchema = z.object({
  fullName: z.string({
    invalid_type_error: "Full Name must be string",
    required_error: "full Name is required",
  })
    .trim()
    .regex(fullNameRegex, {
      message:
        "fullName can only contain letters, spaces, apostrophes, hyphens, and dots.",
    }),
  email: z
    .string({
      invalid_type_error: "email must be string",
      required_error: "email is required",
    })
    .trim()
    .email({
      message: "Invalid email address"
    }),
  phone: z
    .string({
      invalid_type_error: "phone must be string",
      required_error: "phone is required",
    })
    .trim()
    .min(1, "phone is required"),
  password: z
    .string({
      invalid_type_error: "password must be string",
      required_error: "password is required",
    })
    .trim()
    .min(6, "Password minimum 6 characters long")
    .max(60, "Password maximum 60 characters long")
    .optional()
});


export const updateAdministratorAccessSchema = z.object({
  access: z.array(z.enum(VALID_ACCESS_VALUES)).default([]),
});

export const updateAdministratorSchema = z.object({
  fullName: z.string({
    required_error: "full Name is required",
  }),
  phone: z.string({
    required_error: "phone number is required",
  }),
});
