"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xssSanitizer = void 0;
const xss_1 = __importDefault(require("xss"));
function sanitizeInput(obj) {
    const sanitized = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = (0, xss_1.default)(obj[key]); // sanitize strings only
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitized[key] = sanitizeInput(obj[key]); // recurse nested objects
        }
        else {
            sanitized[key] = obj[key]; // leave other types unchanged
        }
    }
    return sanitized;
}
// export function xssSanitizer(req: Request, res: Response, next: NextFunction) {
//   if (req.body) req.body = sanitizeInput(req.body);
//   if (req.query) req.query = sanitizeInput(req.query);
//   if (req.params) req.params = sanitizeInput(req.params);
//   next();
// }
const xssSanitizer = (req, _res, next) => {
    if (req.body) {
        // Don't modify headers or response objects
        // Only sanitize the body content
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                req.body[key] = (0, xss_1.default)(value);
            }
        }
    }
    // Don't modify query parameters that might be needed for CORS
    next();
};
exports.xssSanitizer = xssSanitizer;
