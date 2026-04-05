export declare const usersService: {
    getProfile: (userId: string) => Promise<any>;
    updateProfile: (userId: string, data: any) => Promise<any>;
    getStats: (userId: string) => Promise<{
        xp: any;
        streak: any;
        leaderboard_pos: any;
        courses_completed: number;
        projects_completed: number;
        interests_accepted: number;
    }>;
    getPublicProfile: (userId: string) => Promise<{
        id: any;
        username: any;
        avatar_url: any;
        field: any;
        type: any;
        xp: any;
        streak: any;
        leaderboard_pos: any;
    }>;
    deleteAccount: (userId: string) => Promise<void>;
};
//# sourceMappingURL=users.service.d.ts.map