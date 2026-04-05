// Gemini roadmap generation - optimized for minimal token usage
import geminiPool from '../../config/gemini';

interface RoadmapCourse {
  name: string;
  description: string;
  resource_url: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RoadmapProject {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface RoadmapResult {
  courses: RoadmapCourse[];
  projects: RoadmapProject[];
}

export const generateCourseRoadmap = async (
  interestName: string,
  field: string,
  type: string
): Promise<RoadmapResult> => {
  // Minimal prompt for token efficiency
  const prompt = `Create roadmap for "${interestName}" (${field}/${type}).

Return JSON:
{
  "courses":[{"name":"","description":"","resource_url":"","duration":"e.g. 2h","difficulty":"beginner|intermediate|advanced"}],
  "projects":[{"name":"","description":"","difficulty":"easy|medium|hard"}]
}

5-7 courses (progressive), 2-3 projects. Real URLs preferred.`;

  try {
    const result = await geminiPool.generateJSON<RoadmapResult>(prompt, 800);
    
    // Validate and normalize
    if (result.courses && Array.isArray(result.courses)) {
      return {
        courses: result.courses.slice(0, 7).map((c, i) => ({
          name: c.name || `Module ${i + 1}`,
          description: c.description || '',
          resource_url: c.resource_url || '',
          duration: c.duration || '1-2 hours',
          difficulty: c.difficulty || 'beginner',
        })),
        projects: (result.projects || []).slice(0, 3).map((p, i) => ({
          name: p.name || `Project ${i + 1}`,
          description: p.description || '',
          difficulty: p.difficulty || 'medium',
        })),
      };
    }
  } catch (error) {
    console.error('Roadmap generation error:', error);
  }

  // Fallback roadmap
  return {
    courses: [
      { name: `${interestName} Fundamentals`, description: 'Core concepts and basics', resource_url: '', duration: '2 hours', difficulty: 'beginner' },
      { name: 'Hands-on Practice', description: 'Practical exercises', resource_url: '', duration: '3 hours', difficulty: 'beginner' },
      { name: 'Intermediate Concepts', description: 'Deeper understanding', resource_url: '', duration: '4 hours', difficulty: 'intermediate' },
      { name: 'Real-world Applications', description: 'Building projects', resource_url: '', duration: '5 hours', difficulty: 'intermediate' },
      { name: 'Advanced Techniques', description: 'Professional skills', resource_url: '', duration: '4 hours', difficulty: 'advanced' },
    ],
    projects: [
      { name: 'Starter Project', description: `Build a basic ${interestName} project`, difficulty: 'easy' },
      { name: 'Capstone Project', description: `Complete ${interestName} application`, difficulty: 'medium' },
    ],
  };
};
