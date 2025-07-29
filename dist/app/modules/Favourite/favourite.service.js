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
exports.getFavouriteIdsService = exports.getFavouriteListService = exports.addOrRemoveFavouriteService = void 0;
const mongoose_1 = require("mongoose");
const favourite_model_1 = __importDefault(require("./favourite.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const favourite_constant_1 = require("./favourite.constant");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const addOrRemoveFavouriteService = (loginUserId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check Product doesn't exist
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    //cheack produsct is already existed to favourite list
    const favourite = yield favourite_model_1.default.findOne({
        userId: loginUserId,
        productId
    });
    let result;
    let message;
    //if exist, remove it
    if (favourite) {
        result = yield favourite_model_1.default.deleteOne({ _id: new ObjectId(favourite._id) });
        message = "Removed from your favourite list";
    }
    //if not exist, create a new one
    if (!favourite) {
        result = yield favourite_model_1.default.create({
            userId: loginUserId,
            productId
        });
        message = "Added to your favourite list";
    }
    return {
        message,
        data: result
    };
});
exports.addOrRemoveFavouriteService = addOrRemoveFavouriteService;
const getFavouriteListService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ObjectId = mongoose_1.Types.ObjectId;
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, favourite_constant_1.FavouriteSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield favourite_model_1.default.aggregate([
        {
            $match: { userId: new ObjectId(loginUserId) },
        },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $unwind: "$product"
        },
        {
            $lookup: {
                from: "categories",
                localField: "product.categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                _id: "$product._id",
                name: "$product.name",
                categoryId: "$product.categoryId",
                categoryName: "$category.name",
                currentPrice: "$product.currentPrice",
                originalPrice: "$product.originalPrice",
                discount: "$product.discount",
                ratings: "$product.ratings",
                totalReview: "$product.totalReview",
                images: "$product.images",
                colors: "$product.colors",
                sizes: "$product.sizes",
                introduction: "$product.introduction",
                description: "$product.description",
                status: "$product.status"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $skip: skip },
        { $limit: Number(limit) },
        { $sort: { [sortBy]: sortDirection } },
    ]);
    //count total for pagination
    const totalResultCount = yield favourite_model_1.default.aggregate([
        {
            $match: { userId: new ObjectId(loginUserId) },
        },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $unwind: "$product"
        },
        {
            $lookup: {
                from: "categories",
                localField: "product.categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                _id: "$product._id",
                name: "$product.name",
                categoryId: "$product.categoryId",
                categoryName: "$category.name",
                currentPrice: "$product.currentPrice",
                originalPrice: "$product.originalPrice",
                discount: "$product.discount",
                ratings: "$product.ratings",
                totalReview: "$product.totalReview",
                images: "$product.images",
                colors: "$product.colors",
                sizes: "$product.sizes",
                introduction: "$product.introduction",
                description: "$product.description",
                status: "$product.status"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $count: "totalCount" },
    ]);
    const totalCount = ((_a = totalResultCount[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getFavouriteListService = getFavouriteListService;
const getFavouriteIdsService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield favourite_model_1.default.aggregate([
        {
            $match: { userId: new ObjectId_1.default(loginUserId) }
        }
    ]);
    return (products === null || products === void 0 ? void 0 : products.length) > 0 ? products === null || products === void 0 ? void 0 : products.map((product) => product.productId) : [];
});
exports.getFavouriteIdsService = getFavouriteIdsService;
