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
const Size_service_1 = require("./Size.service");
const createSize = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size } = req.body;
    const result = yield (0, Size_service_1.createSizeService)(size);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Size is created successfully",
        data: result
    });
}));
const getSizeDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Size_service_1.getSizeDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Sizes are retrieved successfully",
        data: result
    });
}));
const updateSize = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sizeId } = req.params;
    const { size } = req.body;
    const result = yield (0, Size_service_1.updateSizeService)(sizeId, size);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Size is updated successfully",
        data: result
    });
}));
const deleteSize = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sizeId } = req.params;
    const result = yield (0, Size_service_1.deleteSizeService)(sizeId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Size is deleted successfully",
        data: result
    });
}));
const SizeController = {
    createSize,
    getSizeDropDown,
    updateSize,
    deleteSize
};
exports.default = SizeController;
