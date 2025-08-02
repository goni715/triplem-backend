"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Faq_controller_1 = __importDefault(require("./Faq.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Faq_validation_1 = require("./Faq.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
router.post('/create-Faq', (0, AuthMiddleware_1.default)("super_admin", "admin"), (0, validationMiddleware_1.default)(Faq_validation_1.createFaqValidationSchema), Faq_controller_1.default.createFaq);
router.get('/get-user-faqs', Faq_controller_1.default.getUserFaqs);
router.get('/get-faqs', (0, AuthMiddleware_1.default)("super_admin", "admin"), Faq_controller_1.default.getFaqs);
router.patch('/update-faq/:faqId', (0, AuthMiddleware_1.default)("super_admin", "admin"), (0, validationMiddleware_1.default)(Faq_validation_1.updateFaqValidationSchema), Faq_controller_1.default.updateFaq);
router.delete('/delete-faq/:faqId', (0, AuthMiddleware_1.default)("super_admin", "admin"), Faq_controller_1.default.deleteFaq);
const FaqRoutes = router;
exports.default = FaqRoutes;
