type XPAction = 'onboarding_complete' | 'module_complete' | 'course_complete' | 'project_complete' | 'daily_login' | 'streak_bonus' | 'first_project' | 'first_course';
export declare const calculateXP: (action: XPAction, multiplier?: number) => number;
export declare const calculateLevel: (xp: number) => number;
export declare const xpForNextLevel: (currentLevel: number) => number;
export declare const calculateStreakBonus: (streakDays: number) => number;
export {};
//# sourceMappingURL=xp-calculator.d.ts.map