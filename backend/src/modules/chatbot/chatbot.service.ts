import geminiPool from "../../config/gemini";
import {
  courseHiveKnowledgeBase,
  KnowledgeBaseEntry,
} from "./knowledge-base";

interface RankedEntry {
  entry: KnowledgeBaseEntry;
  score: number;
}

interface ChatbotAnswer {
  answer: string;
  sources: Array<{
    id: string;
    topic: string;
    question: string;
  }>;
  usedGemini: boolean;
  knowledgeBaseSize: number;
}

const MAX_CONTEXT_SOURCES = 5;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function scoreEntry(queryTokens: string[], entry: KnowledgeBaseEntry): number {
  const questionTokens = tokenize(entry.question);
  const answerTokens = tokenize(entry.answer);
  const topicTokens = tokenize(entry.topic);

  let score = 0;
  for (const token of queryTokens) {
    if (entry.keywords.some((k) => k.toLowerCase() === token)) score += 6;
    if (topicTokens.includes(token)) score += 5;
    if (questionTokens.includes(token)) score += 3;
    if (answerTokens.includes(token)) score += 1;
  }

  return score;
}

function rankKnowledgeBase(query: string, maxResults: number): RankedEntry[] {
  const tokens = tokenize(query);
  const ranked = courseHiveKnowledgeBase
    .map((entry) => ({ entry, score: scoreEntry(tokens, entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  if (ranked.length > 0) return ranked;

  return courseHiveKnowledgeBase.slice(0, maxResults).map((entry) => ({
    entry,
    score: 0,
  }));
}

function buildContext(ranked: RankedEntry[]): string {
  return ranked
    .slice(0, MAX_CONTEXT_SOURCES)
    .map(
      (item, index) =>
        `Source ${index + 1}\nTopic: ${item.entry.topic}\nQuestion: ${
          item.entry.question
        }\nAnswer: ${item.entry.answer}`
    )
    .join("\n\n");
}

function buildFallbackAnswer(ranked: RankedEntry[]): string {
  const top = ranked[0]?.entry;
  if (!top) {
    return "I couldn't find a direct match yet, but I can still help. Try asking about authentication, onboarding, interests, courses, projects, resume analysis, leaderboard, or dashboard usage.";
  }

  const related = ranked
    .slice(1, 4)
    .map((item) => item.entry.question)
    .join(" | ");

  return `${top.answer}${
    related ? `\n\nYou can also ask: ${related}` : ""
  }`;
}

export const chatbotService = {
  getKnowledgeBaseStats: () => ({
    totalQuestions: courseHiveKnowledgeBase.length,
    topics: [...new Set(courseHiveKnowledgeBase.map((item) => item.topic))],
  }),

  ask: async (message: string, maxResults: number = 5): Promise<ChatbotAnswer> => {
    const ranked = rankKnowledgeBase(message, Math.max(1, Math.min(maxResults, 8)));
    const sources = ranked.map((item) => ({
      id: item.entry.id,
      topic: item.entry.topic,
      question: item.entry.question,
    }));

    const context = buildContext(ranked);
    const prompt = `You are CourseHive Assistant.
  You must answer only using the provided knowledge-base context.
  If the question is outside scope, politely say it is outside the available CourseHive project knowledge.
  Write in a natural, conversational tone, like a helpful teammate.
  Prefer short plain-English sentences.
  Avoid robotic phrasing and avoid sounding like documentation.
  Be concise and practical (about 4-8 lines).
  When useful, end with one simple follow-up suggestion.

User Question:
${message}

Knowledge Base Context:
${context}
`;

    try {
      const geminiAnswer = await geminiPool.generateWithFlash(prompt);
      return {
        answer: geminiAnswer?.trim() || buildFallbackAnswer(ranked),
        sources,
        usedGemini: true,
        knowledgeBaseSize: courseHiveKnowledgeBase.length,
      };
    } catch (_error) {
      return {
        answer: buildFallbackAnswer(ranked),
        sources,
        usedGemini: false,
        knowledgeBaseSize: courseHiveKnowledgeBase.length,
      };
    }
  },
};

