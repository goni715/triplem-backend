"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    currentPrice: {
        type: Number,
        required: true,
        trim: true
    },
    originalPrice: {
        type: Number,
        default: 0,
        trim: true
    },
    discount: {
        type: String,
        default: ""
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
        max: 5
    },
    colors: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Color"
        }
    ],
    sizes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Size"
        }
    ],
    introduction: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['visible', 'hidden'],
        default: "visible"
    },
    stockStatus: {
        type: String,
        enum: ['in_stock', 'stock_out', 'up_coming'],
        default: "in_stock"
    },
    images: {
        type: [String],
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const ProductModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = ProductModel;
