// Leaderboard service
import { supabase } from "../../config/database";

export const leaderboardService = {
  // Get global leaderboard (from materialized view)
  getGlobalLeaderboard: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    // Get from leaderboard materialized view
    const { data: entries, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("rank", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get total count
    const { count } = await supabase.from("leaderboard").select("*", { count: "exact", head: true });

    return {
      entries: entries || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  },

  // Get top users by XP (live query)
  getTopByXP: async (limit: number = 10) => {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, avatar_url, xp, streak")
      .order("xp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (users || []).map((user, index) => ({
      rank: index + 1,
      ...user,
    }));
  },

  // Get top users by streak
  getStreakLeaderboard: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, avatar_url, xp, streak")
      .order("streak", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const { count } = await supabase.from("users").select("*", { count: "exact", head: true });

    return {
      entries: (users || []).map((user, index) => ({
        rank: offset + index + 1,
        ...user,
      })),
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  },

  // Get current user's rank
  getUserRank: async (userId: string) => {
    // Get user's info from leaderboard view
    const { data: entry, error } = await supabase.from("leaderboard").select("*").eq("user_id", userId).single();

    if (error || !entry) {
      // User not in leaderboard, get their XP
      const { data: user } = await supabase.from("users").select("xp, streak").eq("id", userId).single();

      if (!user) {
        return { rank: null, xp: 0, streak: 0 };
      }

      // Calculate rank by counting users with more XP
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("xp", user.xp);

      return {
        rank: (count || 0) + 1,
        xp: user.xp,
        streak: user.streak,
      };
    }

    return {
      rank: entry.rank,
      xp: entry.xp,
      streak: entry.streak,
    };
  },

  // Refresh leaderboard (call Supabase function)
  refreshLeaderboard: async () => {
    const { error } = await supabase.rpc("refresh_leaderboard");
    if (error) throw error;
    return { refreshed: true };
  },
};
