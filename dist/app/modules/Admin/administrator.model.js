"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin_constant_1 = require("./admin.constant");
const administratorSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    access: {
        type: [String],
        validate: {
            validator: function (values) {
                return values.every((value) => admin_constant_1.VALID_ACCESS_VALUES.includes(value));
            },
            message: props => `Invalid access values: ${props.value}. Allowed values are ${admin_constant_1.VALID_ACCESS_VALUES.join(", ")}.`
        }
    }
}, {
    timestamps: true,
    versionKey: false
});
const AdministratorModel = (0, mongoose_1.model)("Administrator", administratorSchema);
exports.default = AdministratorModel;
