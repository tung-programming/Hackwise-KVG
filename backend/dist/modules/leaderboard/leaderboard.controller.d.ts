import { Request, Response, NextFunction } from "express";
export declare const leaderboardController: {
    getGlobalLeaderboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTopUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStreakLeaderboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserRank: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=leaderboard.controller.d.ts.map