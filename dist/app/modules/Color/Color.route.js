"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Color_controller_1 = __importDefault(require("./Color.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Color_validation_1 = require("./Color.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/create-color', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Color_validation_1.createColorValidationSchema), Color_controller_1.default.createColor);
router.get("/get-color-drop-down", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Color_controller_1.default.getColorDropDown);
router.patch('/update-color/:colorId', (0, validationMiddleware_1.default)(Color_validation_1.updateColorValidationSchema), Color_controller_1.default.updateColor);
router.delete('/delete-color/:colorId', Color_controller_1.default.deleteColor);
router.get('/get-colors', Color_controller_1.default.getAllColors);
const ColorRoutes = router;
exports.default = ColorRoutes;
