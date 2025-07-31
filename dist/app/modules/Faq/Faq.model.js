"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        default: "General",
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });
const FaqModel = (0, mongoose_1.model)('Faq', faqSchema);
exports.default = FaqModel;
