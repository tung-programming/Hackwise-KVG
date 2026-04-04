// Users service
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';

export const usersService = {
  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        interests: true,
        courses: true,
        projects: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  updateProfile: async (userId: string, data: any) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
      },
    });

    return user;
  },

  getStats: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        streak: true,
        _count: {
          select: {
            courses: true,
            projects: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      coursesCompleted: user._count.courses,
      projectsCompleted: user._count.projects,
    };
  },

  deleteAccount: async (userId: string) => {
    await prisma.user.delete({
      where: { id: userId },
    });
  },
};
