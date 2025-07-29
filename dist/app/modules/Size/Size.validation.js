"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeValidationSchema = void 0;
const zod_1 = require("zod");
exports.sizeValidationSchema = zod_1.z.object({
    size: zod_1.z.string({
        invalid_type_error: "Size must be a valid string value.",
        required_error: "size is required",
    })
        .refine((val) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(val), {
        message: "Size must be one of: XS, S, M, L, XL, XXL.",
    }),
});
