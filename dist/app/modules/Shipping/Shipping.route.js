"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Shipping_controller_1 = __importDefault(require("./Shipping.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Shipping_validation_1 = require("./Shipping.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.get('/get-shipping-address', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), Shipping_controller_1.default.getShippingAddress);
router.patch('/create-update-shipping', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(Shipping_validation_1.createShippingValidationSchema), Shipping_controller_1.default.updateShipping);
const ShippingRoutes = router;
exports.default = ShippingRoutes;
