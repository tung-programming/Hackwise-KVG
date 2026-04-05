"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const errors_1 = require("../../utils/errors");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errors_1.UnauthorizedError('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        throw new errors_1.UnauthorizedError('Invalid token');
    }
};
exports.verifyToken = verifyToken;
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            throw new errors_1.ValidationError(error.errors);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=auth.middleware.js.map