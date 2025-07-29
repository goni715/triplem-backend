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
exports.updateShippingService = exports.getShippingAddressService = void 0;
const Shipping_model_1 = __importDefault(require("./Shipping.model"));
const getShippingAddressService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Shipping_model_1.default.findOne({ userId: loginUserId }).select("streetAddress state city zipCode -_id");
    if (!result) {
        return {
            "streetAddress": "",
            "city": "",
            "state": "",
            "zipCode": ""
        };
    }
    return result;
});
exports.getShippingAddressService = getShippingAddressService;
const updateShippingService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check shipping information
    const shipping = yield Shipping_model_1.default.findOne({ userId: loginUserId });
    if (shipping) {
        //throw new ApiError(409, "You have already set shipping information");
        const result = yield Shipping_model_1.default.updateOne({ userId: loginUserId }, payload, { runValidators: true });
        return result;
    }
    const result = yield Shipping_model_1.default.create(Object.assign(Object.assign({}, payload), { userId: loginUserId }));
    return result;
});
exports.updateShippingService = updateShippingService;
