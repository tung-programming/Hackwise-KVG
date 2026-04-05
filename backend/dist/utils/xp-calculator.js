"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStreakBonus = exports.xpForNextLevel = exports.calculateLevel = exports.calculateXP = void 0;
const XP_VALUES = {
    onboarding_complete: 100,
    module_complete: 25,
    course_complete: 200,
    project_complete: 150,
    daily_login: 10,
    streak_bonus: 5, // per day of streak
    first_project: 50,
    first_course: 50,
};
const calculateXP = (action, multiplier = 1) => {
    return Math.round(XP_VALUES[action] * multiplier);
};
exports.calculateXP = calculateXP;
const calculateLevel = (xp) => {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};
exports.calculateLevel = calculateLevel;
const xpForNextLevel = (currentLevel) => {
    // XP needed for next level
    return Math.pow(currentLevel, 2) * 100;
};
exports.xpForNextLevel = xpForNextLevel;
const calculateStreakBonus = (streakDays) => {
    // Bonus increases with streak length
    if (streakDays <= 7)
        return streakDays * XP_VALUES.streak_bonus;
    if (streakDays <= 30)
        return streakDays * XP_VALUES.streak_bonus * 1.5;
    return streakDays * XP_VALUES.streak_bonus * 2;
};
exports.calculateStreakBonus = calculateStreakBonus;
//# sourceMappingURL=xp-calculator.js.map