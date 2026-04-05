"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Leaderboard routes
const express_1 = require("express");
const leaderboard_controller_1 = require("./leaderboard.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const router = (0, express_1.Router)();
// Public routes
router.get("/", leaderboard_controller_1.leaderboardController.getGlobalLeaderboard);
router.get("/top", leaderboard_controller_1.leaderboardController.getTopUsers);
router.get("/streaks", leaderboard_controller_1.leaderboardController.getStreakLeaderboard);
// Protected route
router.get("/me", auth_guard_1.authGuard, leaderboard_controller_1.leaderboardController.getUserRank);
exports.default = router;
//# sourceMappingURL=leaderboard.routes.js.map