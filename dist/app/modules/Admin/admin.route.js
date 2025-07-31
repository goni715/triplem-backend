"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const admin_controller_1 = __importDefault(require("./admin.controller"));
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.post("/create-admin", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, "admin"), (0, validationMiddleware_1.default)(admin_validation_1.createAdminValidationSchema), admin_controller_1.default.createAdmin);
router.patch("/update-admin/:adminId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, "admin"), (0, validationMiddleware_1.default)(admin_validation_1.updateAdministratorSchema), admin_controller_1.default.updateAdmin);
const AdminRoutes = router;
exports.default = AdminRoutes;
