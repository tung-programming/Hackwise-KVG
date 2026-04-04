// Interests service
import { prisma } from '../../config/database';
import { getRecommendedInterests } from './recommender';

export const interestsService = {
  getUserInterests: async (userId: string) => {
    const interests = await prisma.interest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return interests;
  },

  addInterest: async (userId: string, name: string, category: string) => {
    const interest = await prisma.interest.create({
      data: {
        userId,
        name,
        category,
      },
    });

    return interest;
  },

  removeInterest: async (userId: string, interestId: string) => {
    await prisma.interest.delete({
      where: {
        id: interestId,
        userId,
      },
    });
  },

  getRecommendations: async (userId: string) => {
    const userInterests = await prisma.interest.findMany({
      where: { userId },
    });

    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: 50,
    });

    const recommendations = await getRecommendedInterests(
      userInterests,
      watchHistory
    );

    return recommendations;
  },

  getAllCategories: async () => {
    const categories = [
      { id: 'programming', name: 'Programming', icon: '💻' },
      { id: 'data-science', name: 'Data Science', icon: '📊' },
      { id: 'web-dev', name: 'Web Development', icon: '🌐' },
      { id: 'mobile-dev', name: 'Mobile Development', icon: '📱' },
      { id: 'devops', name: 'DevOps', icon: '⚙️' },
      { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
      { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
      { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
      { id: 'blockchain', name: 'Blockchain', icon: '⛓️' },
      { id: 'design', name: 'UI/UX Design', icon: '🎨' },
    ];

    return categories;
  },
};
