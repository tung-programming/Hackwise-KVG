// Leaderboard service
import { prisma } from '../../config/database';

export const leaderboardService = {
  getGlobalLeaderboard: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          xp: true,
          level: true,
          streak: true,
        },
        orderBy: { xp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      entries: users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getWeeklyLeaderboard: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          xp: true,
          level: true,
          weeklyXp: true,
        },
        orderBy: { weeklyXp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      entries: users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getUserRank: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) {
      return { rank: null };
    }

    const rank = await prisma.user.count({
      where: { xp: { gt: user.xp } },
    });

    return {
      rank: rank + 1,
      xp: user.xp,
    };
  },

  getStreakLeaderboard: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          streak: true,
          longestStreak: true,
        },
        orderBy: { streak: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      entries: users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};
