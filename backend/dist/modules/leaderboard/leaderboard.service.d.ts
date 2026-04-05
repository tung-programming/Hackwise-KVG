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
        id: any;
        username: any;
        avatar_url: any;
        xp: any;
        streak: any;
        rank: number;
    }[]>;
    getStreakLeaderboard: (page: number, limit: number) => Promise<{
        entries: {
            id: any;
            username: any;
            avatar_url: any;
            xp: any;
            streak: any;
            rank: number;
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
    }>;
    refreshLeaderboard: () => Promise<{
        refreshed: boolean;
    }>;
};
//# sourceMappingURL=leaderboard.service.d.ts.map