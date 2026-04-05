"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardController = void 0;
const leaderboard_service_1 = require("./leaderboard.service");
const api_response_1 = require("../../utils/api-response");
exports.leaderboardController = {
    // GET /leaderboard - Get global leaderboard
    getGlobalLeaderboard: async (req, res, next) => {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
            const leaderboard = await leaderboard_service_1.leaderboardService.getGlobalLeaderboard(page, limit);
            res.json(api_response_1.ApiResponse.success(leaderboard));
        }
        catch (error) {
            next(error);
        }
    },
    // GET /leaderboard/top - Get top 10 users
    getTopUsers: async (req, res, next) => {
        try {
            const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
            const topUsers = await leaderboard_service_1.leaderboardService.getTopByXP(limit);
            res.json(api_response_1.ApiResponse.success(topUsers));
        }
        catch (error) {
            next(error);
        }
    },
    // GET /leaderboard/streaks - Get streak leaderboard
    getStreakLeaderboard: async (req, res, next) => {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
            const leaderboard = await leaderboard_service_1.leaderboardService.getStreakLeaderboard(page, limit);
            res.json(api_response_1.ApiResponse.success(leaderboard));
        }
        catch (error) {
            next(error);
        }
    },
    // GET /leaderboard/me - Get current user's rank
    getUserRank: async (req, res, next) => {
        try {
            const userId = req.userId;
            const rank = await leaderboard_service_1.leaderboardService.getUserRank(userId);
            res.json(api_response_1.ApiResponse.success(rank));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=leaderboard.controller.js.map