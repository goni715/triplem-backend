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
const Color_service_1 = require("./Color.service");
const createColor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Color_service_1.createColorService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Color is created successfully',
        data: result,
    });
}));
const getSingleColor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { colorId } = req.params;
    const result = yield (0, Color_service_1.getSingleColorService)(colorId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Color is retrieved successfully',
        data: result,
    });
}));
const getAllColors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Color_service_1.getAllColorsService)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Colors are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getColorDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Color_service_1.getColorDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Colors are retrieved successfully",
        data: result
    });
}));
const updateColor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { colorId } = req.params;
    const result = yield (0, Color_service_1.updateColorService)(colorId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Color is updated successfully',
        data: result,
    });
}));
const deleteColor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { colorId } = req.params;
    const result = yield (0, Color_service_1.deleteColorService)(colorId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Color is deleted successfully',
        data: result,
    });
}));
const ColorController = {
    createColor,
    getSingleColor,
    getAllColors,
    getColorDropDown,
    updateColor,
    deleteColor,
};
exports.default = ColorController;
