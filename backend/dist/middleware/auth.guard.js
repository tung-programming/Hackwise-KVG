"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const authGuard = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new errors_1.UnauthorizedError("No token provided");
        }
        const token = authHeader.split(" ")[1];
        // Verify JWT (works for both our JWT and Supabase JWT)
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // The JWT contains the user ID in the 'sub' claim
        const userId = decoded.sub;
        if (!userId) {
            throw new errors_1.UnauthorizedError("Invalid token payload");
        }
        // Check token type if present (for our custom tokens)
        if (decoded.type && decoded.type !== "access") {
            throw new errors_1.UnauthorizedError("Invalid token type");
        }
        req.userId = userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.UnauthorizedError) {
            next(error);
        }
        else if (error.name === "JsonWebTokenError") {
            next(new errors_1.UnauthorizedError("Invalid token"));
        }
        else if (error.name === "TokenExpiredError") {
            next(new errors_1.UnauthorizedError("Token expired"));
        }
        else {
            next(new errors_1.UnauthorizedError("Authentication failed"));
        }
    }
};
exports.authGuard = authGuard;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            req.userId = decoded.sub;
            req.userEmail = decoded.email;
        }
        catch (error) {
            // Token invalid, continue without auth
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.guard.js.map