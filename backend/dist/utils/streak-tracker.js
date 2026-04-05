"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStreakStatus = exports.updateStreak = void 0;
// Streak calculation logic
const database_1 = require("../config/database");
const xp_calculator_1 = require("./xp-calculator");
const updateStreak = async (userId) => {
    const user = await database_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            streak: true,
            lastActiveAt: true,
            longestStreak: true,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const now = new Date();
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
    let newStreak = 1;
    let streakMaintained = false;
    if (lastActive) {
        const daysSinceLastActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastActive === 0) {
            // Same day, no streak change
            return {
                streak: user.streak,
                xpAwarded: 0,
                streakMaintained: true,
            };
        }
        else if (daysSinceLastActive === 1) {
            // Consecutive day, increment streak
            newStreak = user.streak + 1;
            streakMaintained = true;
        }
        else {
            // Streak broken, reset to 1
            newStreak = 1;
            streakMaintained = false;
        }
    }
    const xpAwarded = (0, xp_calculator_1.calculateStreakBonus)(newStreak);
    const longestStreak = Math.max(newStreak, user.longestStreak || 0);
    await database_1.prisma.user.update({
        where: { id: userId },
        data: {
            streak: newStreak,
            longestStreak,
            lastActiveAt: now,
            xp: { increment: xpAwarded },
        },
    });
    return {
        streak: newStreak,
        xpAwarded,
        streakMaintained,
    };
};
exports.updateStreak = updateStreak;
const checkStreakStatus = async (userId) => {
    const user = await database_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            streak: true,
            longestStreak: true,
            lastActiveAt: true,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const now = new Date();
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
    let hoursUntilStreakLost = null;
    let streakAtRisk = false;
    if (lastActive && user.streak > 0) {
        const endOfDay = new Date(lastActive);
        endOfDay.setDate(endOfDay.getDate() + 2);
        endOfDay.setHours(0, 0, 0, 0);
        hoursUntilStreakLost = Math.max(0, (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60));
        streakAtRisk = hoursUntilStreakLost < 12;
    }
    return {
        currentStreak: user.streak,
        longestStreak: user.longestStreak || 0,
        streakAtRisk,
        hoursUntilStreakLost: hoursUntilStreakLost ? Math.round(hoursUntilStreakLost) : null,
    };
};
exports.checkStreakStatus = checkStreakStatus;
//# sourceMappingURL=streak-tracker.js.map