"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCheckoutService = exports.createCheckoutSessionService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const stripe = new stripe_1.default(config_1.default.stripe_secret_key);
const createCheckoutSessionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const lineItems = [
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Basic T-Shirt",
                },
                unit_amount: 2000, // $20.00
            },
            quantity: 2,
        },
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Coffee Mug",
                },
                unit_amount: 1500, // $15.00
            },
            quantity: 1,
        },
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Wireless Mouse",
                },
                unit_amount: 3500, // $35.00
            },
            quantity: 1,
        },
    ];
    const FRONTEND_URL = "https://triplem-website-integration.vercel.app";
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        metadata: {
            userId: "userId",
        },
        customer_email: "goniosman715149123@gmail.com",
        success_url: `${"https://triplem-website-integration.vercel.app"}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/cancel`,
    });
    return session;
});
exports.createCheckoutSessionService = createCheckoutSessionService;
const verifyCheckoutService = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sessionId) {
        throw new ApiError_1.default(400, "sessionId is required");
    }
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        //payment_status = "no_payment_required", "paid", "unpaid"
        if (session.payment_status !== "paid") {
            throw new ApiError_1.default(403, "Payment Failled");
        }
        //update database base on metadata = session.metadata
        return session;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.verifyCheckoutService = verifyCheckoutService;
