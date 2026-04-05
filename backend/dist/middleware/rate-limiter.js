"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const api_response_1 = require("../utils/api-response");
const store = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // requests per window
const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = store.get(ip);
    if (!entry || now > entry.resetTime) {
        entry = {
            count: 1,
            resetTime: now + WINDOW_MS,
        };
        store.set(ip, entry);
        return next();
    }
    entry.count++;
    if (entry.count > MAX_REQUESTS) {
        res.status(429).json(api_response_1.ApiResponse.error('Too many requests. Please try again later.', 429));
        return;
    }
    next();
};
exports.rateLimiter = rateLimiter;
// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
        if (now > value.resetTime) {
            store.delete(key);
        }
    }
}, 60 * 1000); // Clean up every minute
//# sourceMappingURL=rate-limiter.js.map