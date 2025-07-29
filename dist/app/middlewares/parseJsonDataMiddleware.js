"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseJsonDataMiddleware = (req, res, next) => {
    var _a;
    try {
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
            console.log("parse", JSON.parse(req.body.data));
            req.body = JSON.parse(req.body.data);
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in 'data' field",
        });
    }
};
exports.default = parseJsonDataMiddleware;
