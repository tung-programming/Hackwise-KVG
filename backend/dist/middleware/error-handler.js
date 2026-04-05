"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_response_1 = require("../utils/api-response");
const errors_1 = require("../utils/errors");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json(api_response_1.ApiResponse.error(err.message, err.statusCode, err.errors));
    }
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json(api_response_1.ApiResponse.error('Database operation failed', 400));
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(api_response_1.ApiResponse.error('Invalid token', 401));
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(api_response_1.ApiResponse.error('Token expired', 401));
    }
    // Default error
    res.status(500).json(api_response_1.ApiResponse.error(process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message, 500));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map