"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
const noCache = (req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': false
    });
    next();
};
exports.noCache = noCache;
