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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const Faq_service_1 = require("./Faq.service");
const createFaq = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Faq_service_1.createFaqService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Faq is created successfully',
        data: result,
    });
}));
const getFaqs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Faq_service_1.getFaqsService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faqs are retrieved successfully',
        data: result
    });
}));
const updateFaq = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { faqId } = req.params;
    const result = yield (0, Faq_service_1.updateFaqService)(faqId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faq is updated successfully',
        data: result,
    });
}));
const deleteFaq = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { faqId } = req.params;
    const result = yield (0, Faq_service_1.deleteFaqService)(faqId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Faq is deleted successfully',
        data: result,
    });
}));
const FaqController = {
    createFaq,
    getFaqs,
    updateFaq,
    deleteFaq,
};
exports.default = FaqController;
