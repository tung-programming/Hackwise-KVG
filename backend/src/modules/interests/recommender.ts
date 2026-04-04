// Interest recommendation engine
import geminiPool from '../../config/gemini';

interface Interest {
  id: string;
  name: string;
  category: string;
}

interface WatchHistoryEntry {
  title: string;
  platform: string;
}

export const getRecommendedInterests = async (
  currentInterests: Interest[],
  watchHistory: WatchHistoryEntry[]
): Promise<string[]> => {
  const interestNames = currentInterests.map((i) => i.name).join(', ');
  const historyTitles = watchHistory.map((h) => h.title).join('\n');

  const prompt = `Based on the user's current interests and watch history, suggest 5 new related topics they might want to learn.

Current Interests: ${interestNames || 'None'}

Recent Watch History:
${historyTitles || 'None'}

Return ONLY a JSON array of 5 recommended topic strings, no explanation.
Example: ["React Hooks", "TypeScript", "GraphQL", "Docker", "AWS Lambda"]`;

  try {
    const response = await geminiPool.generateContent(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    const recommendations = JSON.parse(cleaned);
    return Array.isArray(recommendations) ? recommendations : [];
  } catch (error) {
    console.error('Recommendation error:', error);
    return [
      'JavaScript Fundamentals',
      'Python for Data Science',
      'Web Development Basics',
      'Git Version Control',
      'SQL Databases',
    ];
  }
};
