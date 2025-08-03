"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const Payment_controller_1 = __importDefault(require("./Payment.controller"));
const router = express_1.default.Router();
router.post('/create-checkout-session', (0, AuthMiddleware_1.default)('user'), Payment_controller_1.default.createCheckoutSession);
router.get('/verify-checkout', Payment_controller_1.default.verifyCheckout);
const PaymentRoutes = router;
exports.default = PaymentRoutes;
