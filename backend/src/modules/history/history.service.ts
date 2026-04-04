// History service
import { prisma } from '../../config/database';
import { parseHistoryFile } from './history.parser';
import geminiPool from '../../config/gemini';

export const historyService = {
  processUpload: async (userId: string, file: Express.Multer.File) => {
    const entries = await parseHistoryFile(file);

    const created = await prisma.watchHistory.createMany({
      data: entries.map((entry) => ({
        userId,
        title: entry.title,
        url: entry.url,
        watchedAt: entry.watchedAt,
        duration: entry.duration,
        platform: entry.platform,
      })),
      skipDuplicates: true,
    });

    return {
      imported: created.count,
      message: `Successfully imported ${created.count} history entries`,
    };
  },

  getHistory: async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.watchHistory.findMany({
        where: { userId },
        orderBy: { watchedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.watchHistory.count({ where: { userId } }),
    ]);

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  analyzeHistory: async (userId: string) => {
    const history = await prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: 100,
    });

    const titles = history.map((h) => h.title).join('\n');

    const prompt = `Analyze this learning history and identify:
1. Main topics/skills being learned
2. Learning patterns (consistency, focus areas)
3. Suggested next topics

History:
${titles}`;

    const analysis = await geminiPool.generateContent(prompt);

    return {
      totalEntries: history.length,
      analysis,
    };
  },

  clearHistory: async (userId: string) => {
    await prisma.watchHistory.deleteMany({
      where: { userId },
    });
  },
};
