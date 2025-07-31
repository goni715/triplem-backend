"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    total: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    colorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Color"
    },
    size: {
        type: String
    },
}, {
    timestamps: false,
    versionKey: false
});
const orderSchema = new mongoose_1.Schema({
    token: {
        type: String,
        unique: true,
        required: true,
        minlength: [6, "Token must be 6 characters long"],
        maxlength: [6, "Token must be 6 characters long"]
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    products: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one product is required in the order."
        }
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "failled"],
        default: 'unpaid'
    },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    deliveryAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
});
const OrderModel = (0, mongoose_1.model)('Order', orderSchema);
exports.default = OrderModel;
