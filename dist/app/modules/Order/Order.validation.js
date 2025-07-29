"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderValidationSchema = void 0;
const zod_1 = require("zod");
exports.updateOrderValidationSchema = zod_1.z.object({
    status: zod_1.z.string({
        invalid_type_error: "status must be a valid string value.",
    })
        .refine((val) => ['processing', 'shipped', 'delivered', 'cancelled'].includes(val), {
        message: "status must be one of: 'processing', 'shipped', 'delivered', 'cancelled'",
    }).optional(),
    paymentStatus: zod_1.z.string({
        invalid_type_error: "status must be a valid string value.",
    })
        .refine((val) => ['paid', 'failled'].includes(val), {
        message: "status must be one of: 'paid', 'shipped', 'failled'",
    }).optional(),
});
