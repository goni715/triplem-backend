"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const colorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    hexCode: {
        type: String,
        required: true,
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        trim: true,
        unique: true
    },
}, {
    timestamps: true,
    versionKey: false
});
const ColorModel = (0, mongoose_1.model)('Color', colorSchema);
exports.default = ColorModel;
