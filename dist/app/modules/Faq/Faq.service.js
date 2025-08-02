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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaqService = exports.updateFaqService = exports.getUserFaqsService = exports.getFaqsService = exports.createFaqService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const faq_constant_1 = require("./faq.constant");
const Faq_model_1 = __importDefault(require("./Faq.model"));
const slugify_1 = __importDefault(require("slugify"));
const createFaqService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = payload;
    const slug = (0, slugify_1.default)(question).toLowerCase();
    payload.slug = slug;
    //check faq is already exist
    const faq = yield Faq_model_1.default.findOne({ slug });
    if (faq) {
        throw new ApiError_1.default(409, "This question is already existed");
    }
    const result = yield Faq_model_1.default.create(payload);
    return result;
});
exports.createFaqService = createFaqService;
const getFaqsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, faq_constant_1.FaqSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield Faq_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                category: 0,
                slug: 0,
                createdAt: 0,
                updatedAt: 0
            }
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Faq_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.getFaqsService = getFaqsService;
const getUserFaqsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Faq_model_1.default.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $project: {
                category: 0,
                slug: 0,
                createdAt: 0,
                isActive: 0,
                updatedAt: 0
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    return result;
});
exports.getUserFaqsService = getUserFaqsService;
const updateFaqService = (faqId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield Faq_model_1.default.findById(faqId);
    if (!faq) {
        throw new ApiError_1.default(404, "Faq Not Found");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.question) {
        const slug = (0, slugify_1.default)(payload.question).toLowerCase();
        payload.slug = slug;
        const faqExist = yield Faq_model_1.default.findOne({
            _id: { $ne: faqId },
            slug
        });
        if (faqExist) {
            throw new ApiError_1.default(409, "Sorry! This Question is already existed");
        }
    }
    const result = yield Faq_model_1.default.updateOne({ _id: faqId }, payload);
    return result;
});
exports.updateFaqService = updateFaqService;
const deleteFaqService = (faqId) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield Faq_model_1.default.findById(faqId);
    if (!faq) {
        throw new ApiError_1.default(404, "Faq Not Found");
    }
    const result = yield Faq_model_1.default.deleteOne({ _id: faqId });
    return result;
});
exports.deleteFaqService = deleteFaqService;
