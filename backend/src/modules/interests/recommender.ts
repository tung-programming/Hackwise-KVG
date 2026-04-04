// Interest recommendation engine
import geminiPool from "../../config/gemini";

interface HistoryEntry {
  title?: string;
  url?: string;
  search_query?: string;
}

interface RecommendedInterest {
  name: string;
  description: string;
}

// Category mapping for different fields
const CATEGORY_KEYWORDS: Record<string, Record<string, string[]>> = {
  engineering: {
    frontend: ["html", "css", "react", "vue", "angular", "javascript", "typescript", "ui", "ux", "web design", "responsive"],
    backend: ["node", "express", "api", "rest", "graphql", "database", "server", "microservices", "django", "flask", "spring"],
    devops: ["docker", "kubernetes", "ci/cd", "aws", "azure", "gcp", "terraform", "jenkins", "deployment"],
    ml: ["machine learning", "tensorflow", "pytorch", "neural", "ai", "deep learning", "nlp", "computer vision", "data science"],
    mobile: ["android", "ios", "flutter", "react native", "swift", "kotlin", "mobile app"],
    security: ["cybersecurity", "penetration", "hacking", "encryption", "security", "owasp"],
    dsa: ["algorithm", "data structure", "leetcode", "coding interview", "competitive programming"],
  },
  business: {
    finance: ["accounting", "investment", "stock", "trading", "financial analysis", "valuation"],
    marketing: ["digital marketing", "seo", "social media", "branding", "advertising", "content marketing"],
    management: ["leadership", "project management", "agile", "scrum", "team management"],
    analytics: ["business analytics", "data analysis", "excel", "tableau", "power bi"],
  },
  law: {
    criminal: ["criminal law", "criminal procedure", "evidence", "prosecution"],
    corporate: ["corporate law", "mergers", "acquisitions", "contracts", "compliance"],
    civil: ["civil procedure", "torts", "property law", "litigation"],
  },
  medical: {
    clinical: ["diagnosis", "treatment", "patient care", "clinical skills"],
    research: ["medical research", "clinical trials", "biostatistics"],
    specialized: ["cardiology", "neurology", "surgery", "pediatrics"],
  },
};

// Extract keywords from history entries
function extractKeywords(history: HistoryEntry[]): string[] {
  const keywords: string[] = [];

  for (const entry of history) {
    if (entry.title) {
      keywords.push(...entry.title.toLowerCase().split(/\s+/));
    }
    if (entry.search_query) {
      keywords.push(...entry.search_query.toLowerCase().split(/\s+/));
    }
    if (entry.url) {
      // Extract domain and path keywords
      try {
        const url = new URL(entry.url);
        keywords.push(...url.pathname.split(/[/-]/).filter(Boolean));
      } catch (e) {
        // Invalid URL, skip
      }
    }
  }

  return keywords;
}

// Score categories based on keyword frequency
function scoreCategories(
  keywords: string[],
  field: string
): Map<string, number> {
  const scores = new Map<string, number>();
  const fieldCategories = CATEGORY_KEYWORDS[field] || CATEGORY_KEYWORDS.engineering;

  for (const [category, categoryKeywords] of Object.entries(fieldCategories)) {
    let score = 0;
    for (const keyword of keywords) {
      for (const catKeyword of categoryKeywords) {
        if (keyword.includes(catKeyword) || catKeyword.includes(keyword)) {
          score++;
        }
      }
    }
    scores.set(category, score);
  }

  return scores;
}

// Generate interests from browsing history
export async function generateInterestsFromHistory(
  history: HistoryEntry[],
  field: string,
  type: string
): Promise<RecommendedInterest[]> {
  // Extract keywords and score categories
  const keywords = extractKeywords(history);
  const scores = scoreCategories(keywords, field);

  // Get top 4 categories
  const sortedCategories = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat]) => cat);

  // Use Gemini to refine and generate interest names/descriptions
  const historyTitles = history
    .slice(0, 50)
    .map((h) => h.title || h.search_query || "")
    .filter(Boolean)
    .join("\n");

  const prompt = `Based on this user's browsing history and their field (${field}/${type}), suggest the top 4 learning interests.

Browsing History (titles/searches):
${historyTitles}

Top detected categories: ${sortedCategories.join(", ")}

Return a JSON array of exactly 4 interests with this structure:
[
  {"name": "Interest Name", "description": "Brief description of what to learn"},
  ...
]

Make the names specific and actionable (e.g., "React Frontend Development" not just "Frontend").
Return ONLY valid JSON, no markdown or explanation.`;

  try {
    const response = await geminiPool.generateWithFlash(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const interests = JSON.parse(cleaned);

    if (Array.isArray(interests) && interests.length > 0) {
      return interests.slice(0, 4);
    }
  } catch (error) {
    console.error("Gemini interest generation error:", error);
  }

  // Fallback: Generate basic interests from categories
  return sortedCategories.slice(0, 4).map((cat) => ({
    name: formatCategoryName(cat),
    description: `Learn essential ${cat} skills for ${field}/${type}`,
  }));
}

function formatCategoryName(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
