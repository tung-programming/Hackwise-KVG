// Leaderboard routes
import { Router } from 'express';
import { leaderboardController } from './leaderboard.controller';
import { authGuard } from '../../middleware/auth.guard';

const router = Router();

router.get('/global', leaderboardController.getGlobalLeaderboard);
router.get('/weekly', leaderboardController.getWeeklyLeaderboard);
router.get('/streaks', leaderboardController.getStreakLeaderboard);
router.get('/me', authGuard, leaderboardController.getUserRank);

export default router;
