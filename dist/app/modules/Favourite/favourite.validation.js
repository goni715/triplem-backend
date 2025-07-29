"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrRemoveFavouriteSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.addOrRemoveFavouriteSchema = zod_1.z.object({
    productId: zod_1.z
        .string({
        required_error: "productId is required!",
    })
        .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: "productId must be a valid ObjectId",
    }),
});
