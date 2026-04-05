export declare const updateStreak: (userId: string) => Promise<{
    streak: number;
    xpAwarded: number;
    streakMaintained: boolean;
}>;
export declare const checkStreakStatus: (userId: string) => Promise<{
    currentStreak: number;
    longestStreak: number;
    streakAtRisk: boolean;
    hoursUntilStreakLost: number | null;
}>;
//# sourceMappingURL=streak-tracker.d.ts.map