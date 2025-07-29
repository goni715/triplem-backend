"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Size_validation_1 = require("./Size.validation");
const Size_controller_1 = __importDefault(require("./Size.controller"));
const router = express_1.default.Router();
router.post("/create-size", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Size_validation_1.sizeValidationSchema), Size_controller_1.default.createSize);
router.get("/get-size-drop-down", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Size_controller_1.default.getSizeDropDown);
router.patch("/update-size/:sizeId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Size_validation_1.sizeValidationSchema), Size_controller_1.default.updateSize);
router.delete("/delete-size/:sizeId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Size_controller_1.default.deleteSize);
exports.SizeRoutes = router;
