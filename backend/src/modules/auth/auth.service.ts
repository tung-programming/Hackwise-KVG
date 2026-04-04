// Auth service
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { UnauthorizedError } from '../../utils/errors';

export const authService = {
  generateTokens: async (userId: string) => {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId, type: 'refresh' }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  },

  refreshTokens: async (refreshToken: string) => {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      return authService.generateTokens(user.id);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  logout: async (userId: string) => {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  getCurrentUser: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        streak: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  },
};
