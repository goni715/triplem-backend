"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shippingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, unique: true, required: true, ref: "User" },
    streetAddress: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipCode: {
        type: String,
        required: [true, "zipCode is required"],
        trim: true,
        minlength: 5
    },
}, {
    timestamps: true,
    versionKey: false
});
const ShippingModel = (0, mongoose_1.model)('Shipping', shippingSchema);
exports.default = ShippingModel;
