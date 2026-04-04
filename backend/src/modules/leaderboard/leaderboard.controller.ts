// Leaderboard controller
import { Request, Response, NextFunction } from "express";
import { leaderboardService } from "./leaderboard.service";
import { ApiResponse } from "../../utils/api-response";

export const leaderboardController = {
  // GET /leaderboard - Get global leaderboard
  getGlobalLeaderboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

      const leaderboard = await leaderboardService.getGlobalLeaderboard(page, limit);
      res.json(ApiResponse.success(leaderboard));
    } catch (error) {
      next(error);
    }
  },

  // GET /leaderboard/top - Get top 10 users
  getTopUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
      const topUsers = await leaderboardService.getTopByXP(limit);
      res.json(ApiResponse.success(topUsers));
    } catch (error) {
      next(error);
    }
  },

  // GET /leaderboard/streaks - Get streak leaderboard
  getStreakLeaderboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

      const leaderboard = await leaderboardService.getStreakLeaderboard(page, limit);
      res.json(ApiResponse.success(leaderboard));
    } catch (error) {
      next(error);
    }
  },

  // GET /leaderboard/me - Get current user's rank
  getUserRank: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const rank = await leaderboardService.getUserRank(userId);
      res.json(ApiResponse.success(rank));
    } catch (error) {
      next(error);
    }
  },
};
