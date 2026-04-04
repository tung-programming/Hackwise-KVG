// Protect routes middleware - Verifies JWT tokens
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../utils/errors";

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT (works for both our JWT and Supabase JWT)
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    // The JWT contains the user ID in the 'sub' claim
    const userId = decoded.sub;

    if (!userId) {
      throw new UnauthorizedError("Invalid token payload");
    }

    // Check token type if present (for our custom tokens)
    if (decoded.type && decoded.type !== "access") {
      throw new UnauthorizedError("Invalid token type");
    }

    (req as any).userId = userId;
    (req as any).userEmail = decoded.email;

    next();
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(new UnauthorizedError("Authentication failed"));
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      (req as any).userId = decoded.sub;
      (req as any).userEmail = decoded.email;
    } catch (error) {
      // Token invalid, continue without auth
    }
  }

  next();
};
