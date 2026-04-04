// Global error handler
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode, err.errors)
    );
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json(
      ApiResponse.error('Database operation failed', 400)
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.error('Invalid token', 401)
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      ApiResponse.error('Token expired', 401)
    );
  }

  // Default error
  res.status(500).json(
    ApiResponse.error(
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      500
    )
  );
};
