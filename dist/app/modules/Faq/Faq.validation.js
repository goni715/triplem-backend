"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqValidationSchema = exports.createFaqValidationSchema = void 0;
const zod_1 = require("zod");
exports.createFaqValidationSchema = zod_1.z.object({
    question: zod_1.z
        .string({
        required_error: "question is required",
    })
        .min(1, "Question is required")
        .trim()
        .regex(/^.*\?$/, {
        message: "Question must end with a question mark (?)",
    }),
    answer: zod_1.z.string({
        required_error: "answer is required !"
    })
        .trim()
        .min(1, "answer is required !"),
    category: zod_1.z.string().optional(),
});
exports.updateFaqValidationSchema = zod_1.z.object({
    question: zod_1.z
        .string({
        required_error: "question is required",
    })
        .min(1, "Question is required")
        .trim()
        .regex(/^.*\?$/, {
        message: "Question must end with a question mark (?)",
    }).optional(),
    answer: zod_1.z.string({
        invalid_type_error: "answer must be string value",
        required_error: "answer is required !"
    }).optional(),
    category: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean({
        invalid_type_error: "isActive must be boolean value"
    }).optional()
});
