"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInformationValidationSchema = void 0;
const zod_1 = require("zod");
exports.createInformationValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: "email must be string",
        required_error: "email is required",
    })
        .email({
        message: "Invalid email address",
    }),
    phone: zod_1.z
        .string({
        invalid_type_error: "phone must be string",
        required_error: "phone is required",
    })
        .trim()
        .min(1, "phone is required"),
    address: zod_1.z
        .string({
        invalid_type_error: "address must be string",
        required_error: "address is required",
    })
        .trim()
        .min(1, "address is required")
});
