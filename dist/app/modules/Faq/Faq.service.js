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
exports.deleteFaqService = exports.updateFaqService = exports.getFaqsService = exports.createFaqService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Faq_model_1 = __importDefault(require("./Faq.model"));
const slugify_1 = __importDefault(require("slugify"));
const createFaqService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = payload;
    const slug = (0, slugify_1.default)(question).toLowerCase();
    payload.slug = slug;
    //check faq is already exist
    const faq = yield Faq_model_1.default.findOne({ slug });
    if (faq) {
        throw new AppError_1.default(409, "This question is already existed");
    }
    const result = yield Faq_model_1.default.create(payload);
    return result;
});
exports.createFaqService = createFaqService;
const getFaqsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.default.aggregate([
        {
            $project: {
                category: 0,
                isActive: 0,
                slug: 0
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    return result;
});
exports.getFaqsService = getFaqsService;
const updateFaqService = (faqId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield Faq_model_1.default.findById(faqId);
    if (!faq) {
        throw new AppError_1.default(404, "Faq Not Found");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.question) {
        const slug = (0, slugify_1.default)(payload.question).toLowerCase();
        payload.slug = slug;
        const faqExist = yield Faq_model_1.default.findOne({
            _id: { $ne: faqId },
            slug
        });
        if (faqExist) {
            throw new AppError_1.default(409, "Sorry! This Question is already existed");
        }
    }
    const result = yield Faq_model_1.default.updateOne({ _id: faqId }, payload);
    return result;
});
exports.updateFaqService = updateFaqService;
const deleteFaqService = (faqId) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield Faq_model_1.default.findById(faqId);
    if (!faq) {
        throw new AppError_1.default(404, "Faq Not Found");
    }
    const result = yield Faq_model_1.default.deleteOne({ _id: faqId });
    return result;
});
exports.deleteFaqService = deleteFaqService;
