"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColorValidationSchema = exports.createColorValidationSchema = void 0;
const zod_1 = require("zod");
const Category_validation_1 = require("../Category/Category.validation");
exports.createColorValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        invalid_type_error: "name must be string",
        required_error: "name is required",
    })
        .min(1, "name is required")
        .regex(Category_validation_1.categoryRegex, "name only contain letters and valid symbols (' . - & , ( )) are allowed.")
        .trim(),
    hexCode: zod_1.z
        .string({
        required_error: "Hex code is required",
        invalid_type_error: "Hex code must be a string",
    })
        .trim()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Hex code must be a valid color format (e.g., #fff or #ffffff)",
    }),
});
exports.updateColorValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        invalid_type_error: "name must be string",
        required_error: "name is required",
    })
        .min(1, "name is required")
        .regex(Category_validation_1.categoryRegex, "name only contain letters and valid symbols (' . - & , ( )) are allowed.")
        .trim().optional(),
    hexCode: zod_1.z
        .string({
        required_error: "Hex code is required",
        invalid_type_error: "Hex code must be a string",
    })
        .trim()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Hex code must be a valid color format (e.g., #fff or #ffffff)",
    }).optional(),
});
