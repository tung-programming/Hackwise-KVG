// Onboarding service
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { calculateXP } from '../../utils/xp-calculator';

export const onboardingService = {
  getStatus: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompleted: true,
        onboardingStep: true,
        onboardingData: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      completed: user.onboardingCompleted,
      currentStep: user.onboardingStep,
      data: user.onboardingData,
    };
  },

  submitStep: async (userId: string, step: number, data: any) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: step + 1,
        onboardingData: data,
      },
    });

    return {
      currentStep: user.onboardingStep,
      message: 'Step completed',
    };
  },

  complete: async (userId: string) => {
    const xpAwarded = calculateXP('onboarding_complete');

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        xp: { increment: xpAwarded },
      },
    });

    return {
      completed: true,
      xpAwarded,
      totalXp: user.xp,
    };
  },

  skip: async (userId: string) => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: -1,
      },
    });

    return {
      skipped: true,
      message: 'Onboarding skipped',
    };
  },
};
