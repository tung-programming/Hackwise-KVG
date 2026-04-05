// Interests service
import { supabase } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import {
  generateCourseRoadmap,
  toCourseRow,
  toProjectRow,
} from "../courses/roadmap.generator";

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

    const { data: firstPending } = await supabase
      .from("interests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("rank", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstPending?.id && firstPending.id !== interestId) {
      throw new BadRequestError("Only the currently unlocked recommendation can be accepted.");
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
    const { data: interestToReject, error: fetchError } = await supabase
      .from("interests")
      .select("id, rank, status")
      .eq("id", interestId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !interestToReject) throw new NotFoundError("Interest not found");

    // Sequential rule: only the currently unlocked pending interest can be rejected.
    const { data: firstPending } = await supabase
      .from("interests")
      .select("id, rank")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("rank", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (interestToReject.status === "pending" && firstPending?.id && firstPending.id !== interestId) {
      throw new BadRequestError("You can reject only the currently unlocked recommendation.");
    }

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
    const roadmap = await generateCourseRoadmap(
      interest.name,
      field,
      type,
      historySignals.topKeywords.slice(0, 12)
    );

    // Idempotency: clear older generated roadmap artifacts for this interest before insert.
    await supabase.from("courses").delete().eq("interest_id", interest.id).eq("user_id", userId);
    await supabase.from("projects").delete().eq("interest_id", interest.id).eq("user_id", userId);

    const courseRows = roadmap.courses.map((node, index) =>
      toCourseRow(node, index, userId, interest.id)
    );
    const projectRows = roadmap.projects.map((project) =>
      toProjectRow(project, userId, interest.id)
    );

    if (courseRows.length !== 5) {
      throw new Error(`Expected 5 generated course nodes, received ${courseRows.length}.`);
    }
    if (projectRows.length !== 2) {
      throw new Error(`Expected 2 generated projects, received ${projectRows.length}.`);
    }

    const { error: courseInsertError } = await supabase.from("courses").insert(courseRows);
    if (courseInsertError) throw courseInsertError;

    const { error: projectInsertError } = await supabase.from("projects").insert(projectRows);
    if (projectInsertError) throw projectInsertError;

    console.log(`✅ Roadmap generated for "${interest.name}": 5 courses, 2 projects`);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    await supabase
      .from("interests")
      .update({
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", interest.id)
      .eq("user_id", userId);
  }
}
