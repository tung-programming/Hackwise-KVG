// In-memory rate limiting
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/api-response";
import { env } from "../config/env";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 300; // requests per window

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
};

const getUserIdFromAuthHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    const subject = decoded.sub;
    return typeof subject === "string" && subject ? subject : null;
  } catch {
    return null;
  }
};

const getRateLimitKey = (req: Request): string => {
  const userId = getUserIdFromAuthHeader(req);
  if (userId) {
    return `user:${userId}`;
  }

  return `ip:${getClientIp(req)}`;
};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV === "development") {
    return next();
  }

  const key = getRateLimitKey(req);
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    store.set(key, entry);
    return next();
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));
    res.setHeader("Retry-After", retryAfterSeconds.toString());
    res.status(429).json(
      ApiResponse.error("Too many requests. Please try again later.", 429)
    );
    return;
  }

  next();
};

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
