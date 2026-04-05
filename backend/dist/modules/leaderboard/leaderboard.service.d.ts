export declare const leaderboardService: {
    getGlobalLeaderboard: (page: number, limit: number) => Promise<{
        entries: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getTopByXP: (limit?: number) => Promise<{
        rank: any;
        user_id: any;
        username: any;
        avatar_url: any;
        field: any;
        xp: any;
        streak: any;
    }[]>;
    getStreakLeaderboard: (page: number, limit: number) => Promise<{
        entries: {
            rank: number;
            user_id: any;
            username: any;
            avatar_url: any;
            xp: any;
            streak: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserRank: (userId: string) => Promise<{
        rank: any;
        xp: any;
        streak: any;
        totalUsers: number;
    }>;
    refreshLeaderboard: () => Promise<{
        refreshed: boolean;
    }>;
};
//# sourceMappingURL=leaderboard.service.d.ts.map