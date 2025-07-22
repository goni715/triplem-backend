"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: config_1.default.aws_access_key_id,
    secretAccessKey: config_1.default.aws_secret_access_key,
    region: config_1.default.aws_region
});
exports.default = s3;
