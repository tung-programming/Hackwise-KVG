// Interests service
import { supabase } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import geminiPool from "../../config/gemini";

type HistoryEntry = {
  title?: string;
  url?: string;
  search_query?: string;
};

// ✅ Handles all shapes raw_data can be stored as:
//    - Direct array: HistoryEntry[]
//    - Wrapped:      { entries: HistoryEntry[], meta: {...} }
//    - null/undefined
function normalizeHistoryEntries(rawData: unknown): HistoryEntry[] {
  if (!rawData) return [];
  if (Array.isArray(rawData)) return rawData as HistoryEntry[];
  if (
    typeof rawData === "object" &&
    rawData !== null &&
    Array.isArray((rawData as any).entries)
  ) {
    return (rawData as any).entries as HistoryEntry[];
  }
  // ✅ Extra: handle Postgres returning stringified JSON
  if (typeof rawData === "string") {
    try {
      const parsed = JSON.parse(rawData);
      return normalizeHistoryEntries(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

function extractHistorySignals(rawData: unknown) {
  const entries = normalizeHistoryEntries(rawData);
  const stopWords = new Set([
    "the", "and", "for", "with", "from", "that", "this", "your", "into", "what",
    "how", "why", "when", "where", "are", "was", "were", "you", "can", "will",
    "course", "tutorial", "guide", "learn", "learning", "video", "videos", "to",
    "of", "in", "on", "at", "a", "an", "is", "it",
  ]);

  const keywordCount = new Map<string, number>();
  const domainCount = new Map<string, number>();
  const topics: string[] = [];

  for (const entry of entries.slice(0, 300)) {
    const topic = (entry.search_query || entry.title || "").trim();
    if (topic) topics.push(topic);

    const text = `${entry.title || ""} ${entry.search_query || ""}`.toLowerCase();
    const tokens = text
      .split(/[^a-z0-9+#.-]+/g)
      .map((w) => w.trim())
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    for (const token of tokens) {
      keywordCount.set(token, (keywordCount.get(token) || 0) + 1);
    }

    if (entry.url) {
      try {
        const host = new URL(entry.url).hostname.replace(/^www\./, "");
        if (host) domainCount.set(host, (domainCount.get(host) || 0) + 1);
      } catch {
        // Ignore invalid URLs
      }
    }
  }

  const topKeywords = [...keywordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword]) => keyword);

  const topDomains = [...domainCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([domain]) => domain);

  const sampleTopics = [...new Set(topics)].slice(0, 12);

  return {
    topKeywords,
    topDomains,
    sampleTopics,
    hasHistoryContext: entries.length > 0,
  };
}

export const interestsService = {
  getUserInterests: async (userId: string) => {
    const { data: interests, error } = await supabase
      .from("interests")
      .select("*")
      .eq("user_id", userId)
      .order("rank", { ascending: true });

    if (error) throw error;
    return interests || [];
  },

  getInterest: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .select("*")
      .eq("id", interestId)
      .eq("user_id", userId)
      .single();

    if (error || !interest) throw new NotFoundError("Interest not found");

    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("interest_id", interestId)
      .order("node_order", { ascending: true });

    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("interest_id", interestId);

    return {
      ...interest,
      courses: courses || [],
      projects: projects || [],
    };
  },

  acceptInterest: async (userId: string, interestId: string) => {
    const { data: activeInterests } = await supabase
      .from("interests")
      .select("id, name")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .eq("is_completed", false);

    if (activeInterests && activeInterests.length > 0) {
      throw new BadRequestError(
        `You already have an active interest: "${activeInterests[0].name}". Complete it first or reject it to start a new one.`
      );
    }

    const { data: interest, error } = await supabase
      .from("interests")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", interestId)
      .eq("user_id", userId)
      .eq("status", "pending")
      .select()
      .single();

    if (error || !interest) {
      throw new NotFoundError("Interest not found or already processed");
    }

    generateRoadmapAsync(userId, interest).catch((err) => {
      console.error("Roadmap generation failed:", err);
    });

    return {
      interest,
      message: "Interest accepted. Roadmap generation started.",
    };
  },

  rejectInterest: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", interestId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !interest) throw new NotFoundError("Interest not found");
    return interest;
  },

  getProgress: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .select("id, name, progress_pct, is_completed")
      .eq("id", interestId)
      .eq("user_id", userId)
      .single();

    if (error || !interest) throw new NotFoundError("Interest not found");

    const { data: courses } = await supabase
      .from("courses")
      .select("id, name, is_completed, is_locked")
      .eq("interest_id", interestId)
      .order("node_order", { ascending: true });

    const { data: projects } = await supabase
      .from("projects")
      .select("id, name, is_completed, is_locked, is_validated")
      .eq("interest_id", interestId);

    const completedCourses = courses?.filter((c) => c.is_completed).length || 0;
    const totalCourses = courses?.length || 0;

    return {
      interest_id: interest.id,
      name: interest.name,
      progress_pct: interest.progress_pct,
      is_completed: interest.is_completed,
      courses: {
        completed: completedCourses,
        total: totalCourses,
        items: courses || [],
      },
      projects: {
        completed: projects?.filter((p) => p.is_completed).length || 0,
        total: projects?.length || 0,
        items: projects || [],
      },
    };
  },

  canAddNewInterests: async (userId: string) => {
    const { data: activeInterests } = await supabase
      .from("interests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .eq("is_completed", false);

    return !activeInterests || activeInterests.length === 0;
  },
};

async function generateRoadmapAsync(userId: string, interest: any) {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("field, type")
      .eq("id", userId)
      .single();

    const field = user?.field || "engineering";
    const type = user?.type || "general";

    // ✅ Fetch history raw_data for context
    let historyRawData: unknown = null;
    if (interest.history_id) {
      const { data: historyRecord } = await supabase
        .from("browsing_history")
        .select("raw_data")
        .eq("id", interest.history_id)
        .eq("user_id", userId)
        .single();

      historyRawData = historyRecord?.raw_data || null;
    }

    const historySignals = extractHistorySignals(historyRawData);
    const historyContext = historySignals.hasHistoryContext
      ? `
History evidence from uploaded file:
- Frequent topics/queries: ${historySignals.sampleTopics.join(" | ")}
- Top keywords: ${historySignals.topKeywords.join(", ")}
- Frequent platforms/domains: ${historySignals.topDomains.join(", ")}`
      : `
History evidence: Not available. Use interest name and field/type only.`;

    const prompt = `Create a learning roadmap for "${interest.name}" (${field}/${type}).

Goal: Use browsing history evidence to create specific, personalized course names.
Avoid generic names like "Basics", "Module 1", "Introduction to ${interest.name}".
${historyContext}

IMPORTANT: Each course MUST have a real resource_url (YouTube, Coursera, Udemy, freeCodeCamp, MDN, official docs, etc.).
${historySignals.hasHistoryContext ? "At least 70% of course titles should map to detected topics/keywords." : ""}

Return ONLY valid JSON (no markdown):
{
  "courses":[
    {"name":"Specific Course Name","description":"brief what you learn","resource_url":"https://real-url.com","duration":"2h","difficulty":"beginner|intermediate|advanced"}
  ],
  "projects":[
    {"name":"Project Name","description":"what to build","difficulty":"easy|medium|hard"}
  ]
}

Requirements:
- 5-7 courses, progressive difficulty
- 2-3 projects
- REAL URLs only (YouTube search URLs are acceptable fallbacks: https://youtube.com/results?search_query=...)
- Course names must be specific (e.g. "React useReducer & Context API", not "React Advanced")`;

    let roadmap;
    try {
      roadmap = await geminiPool.generateJSON<{
        courses: Array<{
          name: string;
          description: string;
          resource_url: string;
          duration?: string;
          difficulty?: string;
        }>;
        projects: Array<{
          name: string;
          description: string;
          difficulty?: string;
        }>;
      }>(prompt, 1200);
    } catch (parseError) {
      console.error("JSON parse error in roadmap generation, using fallback:", parseError);
      const fallbackResponse = await geminiPool.generateWithFlash(
        `For a ${field}/${type} student learning "${interest.name}", list 5 specific courses as JSON array only: [{"name":"","description":"","resource_url":"https://youtube.com/results?search_query=...","duration":"2h","difficulty":"beginner"}]`,
        800
      );
      const cleaned = fallbackResponse.replace(/```json\n?|\n?```/g, "").trim();
      roadmap = {
        courses: JSON.parse(cleaned),
        projects: [
          {
            name: `Build a ${interest.name} Project`,
            description: "Apply your learning in a real project",
            difficulty: "medium",
          },
        ],
      };
    }

    if (roadmap.courses && Array.isArray(roadmap.courses)) {
      const validCourses = roadmap.courses.filter((c) => c.name && c.name.length > 0);

      for (let i = 0; i < Math.min(validCourses.length, 7); i++) {
        const course = validCourses[i];
        let resourceUrl = course.resource_url;
        if (!resourceUrl || resourceUrl === "null" || !resourceUrl.startsWith("http")) {
          resourceUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            course.name + " tutorial"
          )}`;
        }

        await supabase.from("courses").insert({
          interest_id: interest.id,
          user_id: userId,
          name: course.name,
          description: course.description || `Learn ${course.name}`,
          resource_url: resourceUrl,
          node_order: i + 1,
          is_locked: i !== 0,
          is_completed: false,
          roadmap_data: {
            duration: course.duration || "1-2 hours",
            difficulty: course.difficulty || "beginner",
          },
        });
      }
    }

    if (roadmap.projects && Array.isArray(roadmap.projects)) {
      for (const project of roadmap.projects.slice(0, 3)) {
        if (!project.name) continue;
        await supabase.from("projects").insert({
          interest_id: interest.id,
          user_id: userId,
          name: project.name,
          description: project.description || `Build a ${project.name} project`,
          difficulty: project.difficulty || "medium",
          is_locked: true,
          is_completed: false,
          is_validated: false,
        });
      }
    }

    console.log(
      `✅ Roadmap generated for "${interest.name}": ${roadmap.courses?.length || 0} courses, ${roadmap.projects?.length || 0} projects`
    );
  } catch (error) {
    console.error("Error generating roadmap:", error);

    // Fallback courses
    const fallbackCourses = [
      { name: `${interest.name} Fundamentals`, description: "Core concepts and foundations", difficulty: "beginner" },
      { name: `${interest.name} in Practice`, description: "Hands-on practical exercises", difficulty: "beginner" },
      { name: `Intermediate ${interest.name}`, description: "Building on the basics", difficulty: "intermediate" },
      { name: `${interest.name} Projects`, description: "Real-world project-based learning", difficulty: "intermediate" },
      { name: `Advanced ${interest.name}`, description: "Expert techniques and patterns", difficulty: "advanced" },
    ];

    for (let i = 0; i < fallbackCourses.length; i++) {
      const course = fallbackCourses[i];
      await supabase.from("courses").insert({
        interest_id: interest.id,
        user_id: userId,
        name: course.name,
        description: course.description,
        resource_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          course.name + " tutorial"
        )}`,
        node_order: i + 1,
        is_locked: i !== 0,
        is_completed: false,
        roadmap_data: { duration: "1-2 hours", difficulty: course.difficulty },
      });
    }

    await supabase.from("projects").insert({
      interest_id: interest.id,
      user_id: userId,
      name: `${interest.name} Portfolio Project`,
      description: `Build a complete ${interest.name} project for your portfolio`,
      difficulty: "medium",
      is_locked: true,
      is_completed: false,
      is_validated: false,
    });

    console.log(`⚠️ Fallback roadmap created for: ${interest.name}`);
  }
}