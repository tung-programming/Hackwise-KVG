// Gemini roadmap generation
import geminiPool from '../../config/gemini';

interface RoadmapModule {
  title: string;
  description: string;
  resources: string[];
}

interface Roadmap {
  title: string;
  description: string;
  modules: RoadmapModule[];
}

export const generateCourseRoadmap = async (
  topic: string,
  level: string
): Promise<Roadmap> => {
  const prompt = `Create a learning roadmap for "${topic}" at ${level} level.

Return a JSON object with this structure:
{
  "title": "Course title",
  "description": "Brief course description",
  "modules": [
    {
      "title": "Module title",
      "description": "What you'll learn",
      "resources": ["Resource 1 URL/name", "Resource 2"]
    }
  ]
}

Include 5-8 modules with progressive difficulty. Each module should have 2-4 resources (mix of documentation, tutorials, and practice exercises).

Return ONLY valid JSON, no markdown or explanation.`;

  try {
    const response = await geminiPool.generateContent(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    const roadmap = JSON.parse(cleaned);
    return roadmap;
  } catch (error) {
    console.error('Roadmap generation error:', error);
    return {
      title: `Learn ${topic}`,
      description: `A comprehensive guide to ${topic} for ${level} learners.`,
      modules: [
        {
          title: 'Introduction',
          description: `Getting started with ${topic}`,
          resources: ['Official documentation', 'Getting started guide'],
        },
        {
          title: 'Core Concepts',
          description: 'Understanding the fundamentals',
          resources: ['Tutorial series', 'Practice exercises'],
        },
        {
          title: 'Hands-on Practice',
          description: 'Building real projects',
          resources: ['Project-based learning', 'Code challenges'],
        },
        {
          title: 'Advanced Topics',
          description: 'Deepening your knowledge',
          resources: ['Advanced guides', 'Best practices'],
        },
        {
          title: 'Final Project',
          description: 'Apply everything you learned',
          resources: ['Project ideas', 'Portfolio building'],
        },
      ],
    };
  }
};
