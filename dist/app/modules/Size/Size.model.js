"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sizeSchema = new mongoose_1.Schema({
    size: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    versionKey: false
});
const SizeModel = (0, mongoose_1.model)("Size", sizeSchema);
exports.default = SizeModel;
