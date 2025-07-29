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
exports.deleteColorService = exports.updateColorService = exports.getSingleColorService = exports.getColorDropDownService = exports.getAllColorsService = exports.createColorService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Color_constant_1 = require("./Color.constant");
const Color_model_1 = __importDefault(require("./Color.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = require("mongoose");
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const createColorService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, hexCode } = payload;
    const slug = (0, slugify_1.default)(name).toLowerCase();
    payload.slug = slug;
    //check color name is already existed
    const existingColorName = yield Color_model_1.default.findOne({
        slug
    });
    if (existingColorName) {
        throw new ApiError_1.default(409, 'This color name is already existed');
    }
    //check color code is already existed
    const existingHexCode = yield Color_model_1.default.findOne({
        hexCode
    });
    if (existingHexCode) {
        throw new ApiError_1.default(409, 'This Hex Code is already existed');
    }
    const result = yield Color_model_1.default.create(payload);
    return result;
});
exports.createColorService = createColorService;
const getAllColorsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Color_constant_1.ColorSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield Color_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
                hexCode: 1
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Color_model_1.default.aggregate([
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
exports.getAllColorsService = getAllColorsService;
const getColorDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Color_model_1.default.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
});
exports.getColorDropDownService = getColorDropDownService;
const getSingleColorService = (colorId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Color_model_1.default.findById(colorId);
    if (!result) {
        throw new ApiError_1.default(404, 'Color Not Found');
    }
    return result;
});
exports.getSingleColorService = getSingleColorService;
const updateColorService = (colorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(colorId)) {
        throw new ApiError_1.default(400, "colorId must be a valid ObjectId");
    }
    const existingColor = yield Color_model_1.default.findById(colorId);
    if (!existingColor) {
        throw new ApiError_1.default(404, 'This colorId not found');
    }
    //check color name is already existed
    if (payload === null || payload === void 0 ? void 0 : payload.name) {
        const slug = (0, slugify_1.default)(payload.name).toLowerCase();
        payload.slug = slug;
        const existingColorName = yield Color_model_1.default.findOne({
            _id: { $ne: colorId },
            slug
        });
        if (existingColorName) {
            throw new ApiError_1.default(409, 'This color name is already existed');
        }
    }
    if (payload.hexCode) {
        const existingHexCode = yield Color_model_1.default.findOne({
            _id: { $ne: colorId },
            hexCode: payload.hexCode
        });
        if (existingHexCode) {
            throw new ApiError_1.default(409, 'This Hex Code is already existed');
        }
    }
    const result = yield Color_model_1.default.updateOne({ _id: colorId }, payload);
    return result;
});
exports.updateColorService = updateColorService;
const deleteColorService = (colorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(colorId)) {
        throw new ApiError_1.default(400, "colorId must be a valid ObjectId");
    }
    const color = yield Color_model_1.default.findById(colorId);
    if (!color) {
        throw new ApiError_1.default(404, "colorId Not Found");
    }
    //check if colorId is associated with Product
    const associateWithProduct = yield Product_model_1.default.findOne({
        colors: new ObjectId_1.default(colorId),
    });
    if (associateWithProduct) {
        throw new ApiError_1.default(409, 'Failled to delete, This color is associated with Product');
    }
    const result = yield Color_model_1.default.deleteOne({ _id: colorId });
    return result;
});
exports.deleteColorService = deleteColorService;
