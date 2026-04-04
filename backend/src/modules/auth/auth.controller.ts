// Auth controller
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../utils/api-response';

export const authController = {
  googleCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;
      const tokens = await authService.generateTokens(user.id);
      res.json(ApiResponse.success({ user, ...tokens }));
    } catch (error) {
      next(error);
    }
  },

  githubCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;
      const tokens = await authService.generateTokens(user.id);
      res.json(ApiResponse.success({ user, ...tokens }));
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);
      res.json(ApiResponse.success(tokens));
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await authService.logout(userId);
      res.json(ApiResponse.success({ message: 'Logged out successfully' }));
    } catch (error) {
      next(error);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await authService.getCurrentUser(userId);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },
};
