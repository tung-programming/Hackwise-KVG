// Auth controller - Supabase handles OAuth, this handles user data
import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/api-response";

export const authController = {
  // Get current authenticated user
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await authService.getCurrentUser(userId);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  // Logout user (handled by Supabase on client, this is for backend cleanup if needed)
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(ApiResponse.success({ message: "Logged out successfully" }));
    } catch (error) {
      next(error);
    }
  },
};
