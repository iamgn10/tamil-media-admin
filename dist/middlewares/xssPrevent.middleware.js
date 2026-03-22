"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const he_1 = __importDefault(require("he"));
const sanitizeRequest = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                // First, sanitize the input
                let sanitized = (0, sanitize_html_1.default)(req.body[key], {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // Optionally, encode the sanitized content
                req.body[key] = he_1.default.encode(sanitized);
            }
        }
    }
    next();
};
exports.sanitizeRequest = sanitizeRequest;
