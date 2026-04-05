import geminiPool from "../../config/gemini";

interface HistoryEntry {
  title?: string;
  url?: string;
  search_query?: string;
  watchedAt?: string | Date;
}

interface AnalystInterest {
  name: string;
  description: string;
}

interface RecommendedInterest {
  name: string;
  description: string;
}

function toInterest(item: unknown): RecommendedInterest | null {
  if (!item || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;
  const name = String(obj.name ?? "").trim();
  const description = String(obj.description ?? "Detected from browsing history.").trim();
  if (!name) return null;
  return { name, description };
}

function normalizeGeminiResult(result: unknown): RecommendedInterest[] {
  if (Array.isArray(result)) {
    return result.map(toInterest).filter((v): v is RecommendedInterest => Boolean(v));
  }

  if (result && typeof result === "object") {
    const obj = result as Record<string, unknown>;

    if (Array.isArray(obj.interests)) {
      return obj.interests
        .map(toInterest)
        .filter((v): v is RecommendedInterest => Boolean(v));
    }

    const single = toInterest(obj);
    if (single) return [single];
  }

  return [];
}

async function topUpInterestsFromGemini(
  existing: RecommendedInterest[],
  field: string,
  type: string
): Promise<RecommendedInterest[]> {
  if (existing.length >= 4) return existing.slice(0, 4);

  const missing = 4 - existing.length;
  const existingNames = existing.map((i) => i.name).join(", ");
  const topUpPrompt = `Return ${missing} additional learning interests for a ${field}/${type} student.
Exclude these already selected interests: ${existingNames || "none"}.
Return ONLY JSON array:
[{"name":"2-5 words","description":"under 18 words"}]`;

  try {
    const topUp = await geminiPool.generateJSON<unknown>(topUpPrompt, 500);
    const normalizedTopUp = normalizeGeminiResult(topUp);

    const byName = new Map<string, RecommendedInterest>();
    for (const item of [...existing, ...normalizedTopUp]) {
      const key = item.name.toLowerCase();
      if (!byName.has(key)) byName.set(key, item);
      if (byName.size >= 4) break;
    }

    return Array.from(byName.values()).slice(0, 4);
  } catch (error) {
    console.warn("Gemini top-up interests failed:", error);
    return existing.slice(0, 4);
  }
}

const EDUCATIONAL_DOMAINS = [
  "youtube.com",
  "freecodecamp.org",
  "geeksforgeeks.org",
  "w3schools.com"
];

function parseEntryDate(entry: HistoryEntry): number {
  if (!entry.watchedAt) return 0;
  const d = new Date(entry.watchedAt as string);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function asDisplayList(items: string[], fallback: string): string {
  if (!items.length) return fallback;
  return items.map((v, i) => `${i + 1}. ${v}`).join("\n");
}

function buildHistoryPromptSections(history: HistoryEntry[]) {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // ✅ Sort newest first
  const sorted = [...history].sort((a, b) => parseEntryDate(b) - parseEntryDate(a));

  const recentQueries = sorted
    .filter((e) => {
      const t = parseEntryDate(e);
      // ✅ If no timestamp (t===0), still include in recent - better than losing data
      return t === 0 || (t >= sevenDaysAgo && t <= now);
    })
    .map((e) => e.search_query || e.title || "")
    .filter(Boolean)
    .slice(0, 16);

  const olderQueries = sorted
    .filter((e) => {
      const t = parseEntryDate(e);
      return t > 0 && t >= thirtyDaysAgo && t < sevenDaysAgo;
    })
    .map((e) => e.search_query || e.title || "")
    .filter(Boolean)
    .slice(0, 10);

  const educationalUrls = sorted
    .map((e) => e.url || "")
    .filter((url) => {
      if (!url) return false;
      const lower = url.toLowerCase();
      return EDUCATIONAL_DOMAINS.some((d) => lower.includes(d));
    })
    .slice(0, 12);

  const topTitles = [...new Set(
    sorted
      .map((e) => e.title || "")
      .filter(Boolean)
  )].slice(0, 16);

  return { recentQueries, olderQueries, educationalUrls, topTitles };
}

export async function generateInterestsFromHistory(
  history: HistoryEntry[],
  field: string,
  type: string
): Promise<RecommendedInterest[]> {
  if (!Array.isArray(history) || history.length === 0) {
    console.warn("generateInterestsFromHistory: empty history array");
    return [];
  }

  const { recentQueries, olderQueries, educationalUrls, topTitles } =
    buildHistoryPromptSections(history);

  console.log(`📊 History sections: recent=${recentQueries.length} older=${olderQueries.length} edu=${educationalUrls.length} titles=${topTitles.length}`);

  const prompt = `You are an educational interest analyst. Analyze this student's browsing history and identify their top 4 learning interests.

STUDENT PROFILE:
- Academic field: ${field}
- Specialization: ${type}

BROWSING DATA:
Recent searches/visits (last 7 days):
${asDisplayList(recentQueries, "None available")}

Older searches/visits (8-30 days):
${asDisplayList(olderQueries, "None available")}

Educational sites visited:
${asDisplayList(educationalUrls, "None available")}

Most visited page titles:
${asDisplayList(topTitles, "None available")}

RULES:
1. Return exactly 4 interests relevant to ${field}/${type}.
2. Weight recent activity more heavily than older activity.
3. Look for repeated topic clusters across multiple entries.
4. Ignore non-educational content (social media, entertainment, shopping).
5. If fewer than 4 clear interests exist in the data, fill slots with high-demand ${field}/${type} topics.
6. Each name must be 2-5 words, specific and actionable (e.g. "React State Management" not "React").
7. Keep each description under 18 words.
8. Output plain JSON array only. Do not use markdown/code fences.

Return ONLY a JSON array, no markdown, no explanation:
[
  {"name": "Topic Name", "description": "One sentence: what they are learning and why this interest was detected."},
  {"name": "Topic Name", "description": "One sentence description."},
  {"name": "Topic Name", "description": "One sentence description."},
  {"name": "Topic Name", "description": "One sentence description."}
]`;

  try {
    const result = await geminiPool.generateJSON<unknown>(prompt, 1100);
    const normalized = normalizeGeminiResult(result);

    if (normalized.length === 0) {
      console.warn("Gemini returned non-array or empty result:", result);
      return [];
    }
    return topUpInterestsFromGemini(normalized, field, type);
  } catch (error) {
    console.error("Gemini interest generation error:", error);
    return [];
  }
}
