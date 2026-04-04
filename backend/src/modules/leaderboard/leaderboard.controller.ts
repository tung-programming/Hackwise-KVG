// Leaderboard controller
import { Request, Response, NextFunction } from 'express';
import { leaderboardService } from './leaderboard.service';
import { ApiResponse } from '../../utils/api-response';

export const leaderboardController = {
  getGlobalLeaderboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const leaderboard = await leaderboardService.getGlobalLeaderboard(
        Number(page),
        Number(limit)
      );
      res.json(ApiResponse.success(leaderboard));
    } catch (error) {
      next(error);
    }
  },

  getWeeklyLeaderboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const leaderboard = await leaderboardService.getWeeklyLeaderboard(
        Number(page),
        Number(limit)
      );
      res.json(ApiResponse.success(leaderboard));
    } catch (error) {
      next(error);
    }
  },

  getUserRank: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const rank = await leaderboardService.getUserRank(userId);
      res.json(ApiResponse.success(rank));
    } catch (error) {
      next(error);
    }
  },

  getStreakLeaderboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const leaderboard = await leaderboardService.getStreakLeaderboard(
        Number(page),
        Number(limit)
      );
      res.json(ApiResponse.success(leaderboard));
    } catch (error) {
      next(error);
    }
  },
};
