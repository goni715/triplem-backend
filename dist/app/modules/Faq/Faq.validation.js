"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqValidationSchema = exports.createFaqValidationSchema = void 0;
const zod_1 = require("zod");
exports.createFaqValidationSchema = zod_1.z.object({
    question: zod_1.z.string({
        required_error: "question is required!"
    }),
    answer: zod_1.z.string({
        required_error: "answer is required !"
    }),
    category: zod_1.z.string().optional(),
});
exports.updateFaqValidationSchema = zod_1.z.object({
    question: zod_1.z.string({
        required_error: "question is required!"
    }).optional(),
    answer: zod_1.z.string({
        required_error: "answer is required !"
    }).optional(),
    category: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional()
});
