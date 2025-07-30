"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteProductService = exports.updateProductImgService = exports.updateProductService = exports.getSingleProductService = exports.getProductsService = exports.getUserProductsService = exports.createProductService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Product_constant_1 = require("./Product.constant");
const Product_model_1 = __importDefault(require("./Product.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const slugify_1 = __importDefault(require("slugify"));
const Category_model_1 = __importDefault(require("../Category/Category.model"));
const Color_model_1 = __importDefault(require("../Color/Color.model"));
const Size_model_1 = __importDefault(require("../Size/Size.model"));
const mongoose_1 = __importStar(require("mongoose"));
const hasDuplicates_1 = __importDefault(require("../../utils/hasDuplicates"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const favourite_model_1 = __importDefault(require("../Favourite/favourite.model"));
const cloudinary_1 = __importDefault(require("../../helper/cloudinary"));
const createProductService = (req, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    let images = [];
    if (req.files && req.files.length > 0) {
        const files = req.files;
        // for (const file of files) {
        //   const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
        //   images.push(path)
        // }
        images = yield Promise.all(files === null || files === void 0 ? void 0 : files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'MTK-Ecommerce',
                // width: 300,
                // crop: 'scale',
            });
            // Delete local file (non-blocking)
            // fs.unlink(file.path);
            return result.secure_url;
        })));
    }
    else {
        throw new ApiError_1.default(400, "Minimum one image required");
    }
    //destructuring the reqBody
    if (!reqBody) {
        throw new ApiError_1.default(400, "name is required!");
    }
    const { name, categoryId, introduction, description, currentPrice, originalPrice, discount, colors, sizes, status, stockStatus } = reqBody;
    let payload = {};
    if (!name) {
        throw new ApiError_1.default(400, "name is required!");
    }
    if (!categoryId) {
        throw new ApiError_1.default(400, "categoryId is required!");
    }
    if (!mongoose_1.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError_1.default(400, "categoryId must be a valid ObjectId");
    }
    if (!introduction) {
        throw new ApiError_1.default(400, "introduction is required!");
    }
    if (!description) {
        throw new ApiError_1.default(400, "description is required!");
    }
    //check current price
    if (!currentPrice) {
        throw new ApiError_1.default(400, "currentPrice is required!");
    }
    if (typeof Number(currentPrice) !== "number" || isNaN(Number(currentPrice))) {
        throw new ApiError_1.default(400, "current price must be a valid number");
    }
    // Step 4: Must be greater than 0
    if (Number(currentPrice) <= 0) {
        throw new ApiError_1.default(400, "Current price must be greater than 0");
    }
    //set required fields
    payload = {
        name,
        images,
        categoryId,
        introduction,
        description,
        currentPrice: Number(currentPrice),
    };
    //check original price
    if (originalPrice) {
        if (typeof Number(originalPrice) !== "number" || isNaN(Number(originalPrice))) {
            throw new ApiError_1.default(400, "original price must be a valid number");
        }
        // Step 4: Must be greater than 0
        if (Number(originalPrice) <= 0) {
            throw new ApiError_1.default(400, "original price must be greater than 0");
        }
        payload.originalPrice = Number(originalPrice);
    }
    //check discount
    if (discount) {
        payload.discount = discount;
    }
    //check colors
    if (colors) {
        if (typeof colors === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(colors)) {
                throw new ApiError_1.default(400, "colors must be valid ObjectId");
            }
            payload.colors = [colors];
        }
        if (Array.isArray(colors)) {
            for (let i = 0; i < colors.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(colors[i])) {
                    throw new ApiError_1.default(400, "colors must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(colors)) {
                throw new ApiError_1.default(400, "colors can not be duplicate value");
            }
            payload.colors = colors;
        }
    }
    //check sizes
    if (sizes) {
        if (typeof sizes === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(sizes)) {
                throw new ApiError_1.default(400, "sizes must be valid ObjectId");
            }
            payload.sizes = [sizes];
        }
        if (Array.isArray(sizes)) {
            for (let i = 0; i < sizes.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(sizes[i])) {
                    throw new ApiError_1.default(400, "sizes must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(sizes)) {
                throw new ApiError_1.default(400, "sizes can not be duplicate value");
            }
            payload.sizes = sizes;
        }
    }
    //check status
    if (status) {
        if (!['visible', 'hidden'].includes(status)) {
            throw new ApiError_1.default(400, "status must be one of: 'visible', 'hidden'");
        }
        payload.status = status;
    }
    //check stock status
    if (stockStatus) {
        if (!['in_stock', 'stock_out', 'up_coming'].includes(stockStatus)) {
            throw new ApiError_1.default(400, "Stock Status must be one of: in_stock', 'stock_out', 'up_coming'");
        }
        payload.stockStatus = stockStatus;
    }
    //make slug
    const slug = (0, slugify_1.default)(name).toLowerCase();
    payload.slug = slug;
    //check product name is already existed
    const product = yield Product_model_1.default.findOne({
        slug
    });
    if (product) {
        throw new ApiError_1.default(409, "This name is already taken.");
    }
    //check categoryId
    const existingCategory = yield Category_model_1.default.findById(categoryId);
    if (!existingCategory) {
        throw new ApiError_1.default(404, 'This categoryId not found');
    }
    //check color
    if (colors && (colors === null || colors === void 0 ? void 0 : colors.length) > 0) {
        for (let i = 0; i < colors.length; i++) {
            const color = yield Color_model_1.default.findById(colors[i]);
            if (!color) {
                throw new ApiError_1.default(400, `This '${colors[i]}' colorId not found`);
            }
        }
    }
    //check size
    if (sizes && (sizes === null || sizes === void 0 ? void 0 : sizes.length) > 0) {
        for (let i = 0; i < sizes.length; i++) {
            const size = yield Size_model_1.default.findById(sizes[i]);
            if (!size) {
                throw new ApiError_1.default(400, `This '${sizes[i]}' sizeId not found`);
            }
        }
    }
    const result = yield Product_model_1.default.create(payload);
    return result;
});
exports.createProductService = createProductService;
const getUserProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt", ratings, categoryId, fromPrice, toPrice } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy", "ratings", "categoryId", "fromPrice", "toPrice"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    // const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Product_constant_1.ProductSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //filter by category
    if (categoryId) {
        if (typeof categoryId === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(categoryId)) {
                throw new ApiError_1.default(400, "categoryId must be valid ObjectId");
            }
            //payload.colors = [categoryId]
            filterQuery = Object.assign(Object.assign({}, filterQuery), { categoryId: { $in: [new mongoose_1.Types.ObjectId(categoryId)] } });
        }
        if (Array.isArray(categoryId)) {
            for (let i = 0; i < categoryId.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(categoryId[i])) {
                    throw new ApiError_1.default(400, "categoryId must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(categoryId)) {
                throw new ApiError_1.default(400, "categoryId can not be duplicate value");
            }
            const categoryObjectIds = categoryId === null || categoryId === void 0 ? void 0 : categoryId.map(id => new mongoose_1.Types.ObjectId(id));
            filterQuery = Object.assign(Object.assign({}, filterQuery), { categoryId: { $in: categoryObjectIds } });
        }
    }
    //filter by ratings
    if (ratings) {
        if (typeof Number(ratings) !== "number" || isNaN(Number(ratings))) {
            throw new ApiError_1.default(400, "ratings must be a valid number");
        }
        if (Number(ratings) > 5) {
            throw new ApiError_1.default(400, "ratings value must be between 1-5");
        }
        if (Number(ratings) > 0) {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { ratings: Number(ratings) });
        }
    }
    //filter by price range
    if (fromPrice && toPrice) {
        if (typeof Number(fromPrice) !== "number" || isNaN(Number(fromPrice))) {
            throw new ApiError_1.default(400, "fromPrice must be a valid number");
        }
        if (typeof Number(toPrice) !== "number" || isNaN(Number(toPrice))) {
            throw new ApiError_1.default(400, "toPrice must be a valid number");
        }
        if (Number(fromPrice) >= Number(toPrice)) {
            throw new ApiError_1.default(400, "toPrice must be greater than fromPrice");
        }
        if (Number(fromPrice) >= 0 && Number(toPrice) > 0) {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { currentPrice: { $gte: Number(fromPrice), $lte: Number(toPrice) } });
        }
    }
    const result = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign(Object.assign({}, searchQuery), filterQuery), { status: "visible" }),
        },
        { $sort: { ratings: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign(Object.assign({}, searchQuery), filterQuery), { status: "visible" })
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.getUserProductsService = getUserProductsService;
const getProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    // const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Product_constant_1.ProductSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status",
                stockStatus: "$stockStatus",
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $sort: { ratings: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                colors: "$colors",
                sizes: "$sizes",
                introduction: "$introduction",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.getProductsService = getProductsService;
const getSingleProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    const product = yield Product_model_1.default.aggregate([
        {
            $match: { _id: new ObjectId_1.default(productId) }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "colors",
                localField: "colors",
                foreignField: "_id",
                as: "colors"
            }
        },
        {
            $lookup: {
                from: "sizes",
                localField: "sizes",
                foreignField: "_id",
                as: "sizes"
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                colors: {
                    $map: {
                        input: "$colors",
                        as: "color",
                        in: {
                            _id: "$$color._id",
                            name: "$$color.name",
                            hexCode: "$$color.hexCode"
                        }
                    }
                },
                sizes: {
                    $map: {
                        input: "$sizes",
                        as: "size",
                        in: {
                            _id: "$$size._id",
                            size: "$$size.size",
                        }
                    }
                },
                introduction: "$introduction",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
    ]);
    if (product.length === 0) {
        throw new ApiError_1.default(404, 'Product Not Found');
    }
    const categoryId = (_a = product[0]) === null || _a === void 0 ? void 0 : _a.categoryId;
    //find related products
    const relatedProducts = yield Product_model_1.default.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose_1.Types.ObjectId(productId) },
                categoryId: categoryId,
                status: "visible"
            }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status"
            },
        },
    ]);
    return {
        product: product[0],
        relatedProducts
    };
});
exports.getSingleProductService = getSingleProductService;
const updateProductService = (req, productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    if (payload.originalPrice) {
        if (product.currentPrice > payload.originalPrice) {
            throw new ApiError_1.default(400, "Original price must be more than current price");
        }
    }
    //desctructuring the payload
    const { name } = payload;
    //check product name is already existed
    if (name) {
        const slug = (0, slugify_1.default)(name).toLowerCase();
        payload.slug = slug;
        const existingProductName = yield Product_model_1.default.findOne({
            _id: { $ne: productId },
            slug
        });
        if (existingProductName) {
            throw new ApiError_1.default(409, 'This Product name is already existed');
        }
    }
    //update the product
    const result = yield Product_model_1.default.updateOne({ _id: productId }, payload, { runValidators: true });
    return result;
});
exports.updateProductService = updateProductService;
const updateProductImgService = (req, productId) => __awaiter(void 0, void 0, void 0, function* () {
    let images = [];
    if (req.files && req.files.length > 0) {
        const files = req.files;
        // for (const file of files) {
        //   const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
        //   images.push(path)
        // }
        images = yield Promise.all(files === null || files === void 0 ? void 0 : files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'MTK-Ecommerce',
                // width: 300,
                // crop: 'scale',
            });
            // Delete local file (non-blocking)
            // fs.unlink(file.path);
            return result.secure_url;
        })));
    }
    else {
        throw new ApiError_1.default(400, "Minimum one image required");
    }
    const result = yield Product_model_1.default.updateOne({ _id: productId }, { images }, { runValidators: true });
    return result;
});
exports.updateProductImgService = updateProductImgService;
const deleteProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete favourite list
        yield favourite_model_1.default.deleteMany({ productId: new ObjectId_1.default(productId) }, { session });
        //delete from cart list
        yield favourite_model_1.default.deleteMany({ productId: new ObjectId_1.default(productId) }, { session });
        //delete the reviews
        // await ReviewModel.deleteMany(
        //   { restaurantId: new ObjectId(restaurant._id) },
        //   { session }
        // );
        //delete product
        const result = yield Product_model_1.default.deleteOne({ _id: new ObjectId_1.default(productId) }, { session });
        //transaction success
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.deleteProductService = deleteProductService;
