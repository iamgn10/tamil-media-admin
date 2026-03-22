"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).json({
                message: 'Validation error',
                errors,
            });
            return;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
