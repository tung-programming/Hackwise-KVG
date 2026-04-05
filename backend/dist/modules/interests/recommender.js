"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterestsFromHistory = generateInterestsFromHistory;
const gemini_1 = __importDefault(require("../../config/gemini"));
const EDUCATIONAL_DOMAINS = [
    "youtube.com",
    "freecodecamp.org",
    "geeksforgeeks.org",
    "w3schools.com"
];
function parseEntryDate(entry) {
    if (!entry.watchedAt)
        return 0;
    const d = new Date(entry.watchedAt);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
function asDisplayList(items, fallback) {
    if (!items.length)
        return fallback;
    return items.map((v, i) => `${i + 1}. ${v}`).join("\n");
}
function buildHistoryPromptSections(history) {
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
        if (!url)
            return false;
        const lower = url.toLowerCase();
        return EDUCATIONAL_DOMAINS.some((d) => lower.includes(d));
    })
        .slice(0, 12);
    const topTitles = [...new Set(sorted
            .map((e) => e.title || "")
            .filter(Boolean))].slice(0, 16);
    return { recentQueries, olderQueries, educationalUrls, topTitles };
}
async function generateInterestsFromHistory(history, field, type) {
    if (!Array.isArray(history) || history.length === 0) {
        console.warn("generateInterestsFromHistory: empty history array");
        return [];
    }
    const { recentQueries, olderQueries, educationalUrls, topTitles } = buildHistoryPromptSections(history);
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
        const result = await gemini_1.default.generateJSON(prompt, 1100);
        if (!Array.isArray(result) || result.length === 0) {
            console.warn("Gemini returned non-array or empty result:", result);
            return [];
        }
        return result.slice(0, 4).map((item) => ({
            name: String(item.name || "").trim(),
            description: String(item.description || "Detected from browsing history.").trim(),
        })).filter(item => item.name.length > 0);
    }
    catch (error) {
        console.error("Gemini interest generation error:", error);
        return [];
    }
}
//# sourceMappingURL=recommender.js.map