"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
        // Ensure the error prototype is set correctly (for instanceof checks)
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
