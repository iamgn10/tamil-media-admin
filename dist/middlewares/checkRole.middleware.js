"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccess = void 0;
const canAccess = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.roleName; // Get the user's role name from the request object
        if (!userRole || !allowedRoles.includes(userRole)) {
            // If the user doesn't have the required role, send a 403 Forbidden response
            res.status(403).json({
                status: false,
                message: 'Access denied. You do not have the required role.',
                statusCode: 403,
                code: '001-403',
            });
            return; // Stop further processing
        }
        // If the user has the required role, call next() to pass control to the next middleware
        next();
    };
};
exports.canAccess = canAccess;
