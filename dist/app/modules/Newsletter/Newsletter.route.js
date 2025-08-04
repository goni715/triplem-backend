"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Newsletter_validation_1 = require("./Newsletter.validation");
const Newsletter_controller_1 = __importDefault(require("./Newsletter.controller"));
const router = express_1.default.Router();
router.post('/subscribe', (0, validationMiddleware_1.default)(Newsletter_validation_1.newsletterValidationSchema), Newsletter_controller_1.default.subscribeToNewsletter);
const NewsletterRoutes = router;
exports.default = NewsletterRoutes;
