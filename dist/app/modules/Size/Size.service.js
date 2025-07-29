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
exports.deleteSizeService = exports.updateSizeService = exports.getSizeDropDownService = exports.createSizeService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Size_model_1 = __importDefault(require("./Size.model"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const createSizeService = (size) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(size).toLowerCase();
    //check size is already existed
    const existingSize = yield Size_model_1.default.findOne({
        slug
    });
    if (existingSize) {
        throw new ApiError_1.default(409, 'This size is already existed');
    }
    const result = yield Size_model_1.default.create({
        size,
        slug
    });
    return result;
});
exports.createSizeService = createSizeService;
const getSizeDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Size_model_1.default.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
});
exports.getSizeDropDownService = getSizeDropDownService;
const updateSizeService = (sizeId, size) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSize = yield Size_model_1.default.findById(sizeId);
    if (!existingSize) {
        throw new ApiError_1.default(404, 'This sizeId not found');
    }
    const slug = (0, slugify_1.default)(size).toLowerCase();
    const sizeExist = yield Size_model_1.default.findOne({
        _id: { $ne: sizeId },
        slug
    });
    if (sizeExist) {
        throw new ApiError_1.default(409, 'Sorry! This size is already existed');
    }
    const result = yield Size_model_1.default.updateOne({ _id: sizeId }, {
        size,
        slug
    });
    return result;
});
exports.updateSizeService = updateSizeService;
const deleteSizeService = (sizeId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSize = yield Size_model_1.default.findById(sizeId);
    if (!existingSize) {
        throw new ApiError_1.default(404, 'This sizeId not found');
    }
    //check if sizeidId is associated with Product
    const associateWithProduct = yield Product_model_1.default.findOne({
        sizes: { $in: [new ObjectId_1.default(sizeId)] }
    });
    if (associateWithProduct) {
        throw new ApiError_1.default(409, 'Failled to delete, This size is associated with Product');
    }
    const result = yield Size_model_1.default.deleteOne({ _id: sizeId });
    return result;
});
exports.deleteSizeService = deleteSizeService;
