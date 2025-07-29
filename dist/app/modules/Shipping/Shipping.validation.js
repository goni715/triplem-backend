"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingValidationSchema = void 0;
const zod_1 = require("zod");
exports.createShippingValidationSchema = zod_1.z.object({
    streetAddress: zod_1.z
        .string({
        invalid_type_error: "street address must be string",
        required_error: "Street Address is required"
    })
        .trim()
        .min(1, { message: "Street Address is required" }),
    city: zod_1.z
        .string({
        invalid_type_error: "city must be string",
        required_error: "city is required"
    })
        .trim()
        .min(1, { message: "City is required" }),
    state: zod_1.z
        .string({
        invalid_type_error: "state must be string",
        required_error: "State is required"
    })
        .trim()
        .min(1, { message: "State is required" }),
    zipCode: zod_1.z
        .string({
        required_error: "Zip Code is required"
    })
        .trim()
        .min(5, { message: "Zip Code must be at least 5 digits" })
        .regex(/^\d+$/, { message: "Zip Code must contain only numbers" }),
});
