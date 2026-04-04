// Leaderboard routes
import { Router } from "express";
import { leaderboardController } from "./leaderboard.controller";
import { authGuard } from "../../middleware/auth.guard";

const router = Router();

// Public routes
router.get("/", leaderboardController.getGlobalLeaderboard);
router.get("/top", leaderboardController.getTopUsers);
router.get("/streaks", leaderboardController.getStreakLeaderboard);

// Protected route
router.get("/me", authGuard, leaderboardController.getUserRank);

export default router;
