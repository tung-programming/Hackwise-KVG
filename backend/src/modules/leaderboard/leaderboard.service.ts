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
      entries: (entries || []).map((entry: any) => ({
        ...entry,
        xp: entry.total_xp || 0,
      })),
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
    const { data: entries, error } = await supabase
      .from("leaderboard")
      .select("user_id, username, field, total_xp, rank")
      .order("total_xp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const userIds = (entries || []).map((entry: any) => entry.user_id);
    const { data: users } = await supabase
      .from("users")
      .select("id, avatar_url, streak")
      .in("id", userIds);

    const userMap = new Map((users || []).map((user: any) => [user.id, user]));

    return (entries || []).map((entry: any, index) => ({
      rank: entry.rank || index + 1,
      user_id: entry.user_id,
      username: entry.username,
      avatar_url: userMap.get(entry.user_id)?.avatar_url || null,
      field: entry.field || "Engineering",
      xp: entry.total_xp || 0,
      streak: userMap.get(entry.user_id)?.streak || 0,
    }));
  },

  // Get top users by streak
  getStreakLeaderboard: async (page: number, limit: number) => {
    const offset = (page - 1) * limit;

    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, avatar_url, streak")
      .order("streak", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const userIds = (users || []).map((user: any) => user.id);
    const { data: leaderboardRows } = await supabase
      .from("leaderboard")
      .select("user_id, total_xp")
      .in("user_id", userIds);

    const xpMap = new Map((leaderboardRows || []).map((row: any) => [row.user_id, row.total_xp || 0]));

    const { count } = await supabase.from("users").select("*", { count: "exact", head: true });

    return {
      entries: (users || []).map((user: any, index) => ({
        rank: offset + index + 1,
        user_id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        xp: xpMap.get(user.id) || 0,
        streak: user.streak,
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
    const { data: user } = await supabase
      .from("users")
      .select("xp, streak")
      .eq("id", userId)
      .single();

    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });

    // Get user's info from leaderboard view
    const { data: entry, error } = await supabase.from("leaderboard").select("*").eq("user_id", userId).single();

    if (error || !entry) {
      if (!user) {
        return { rank: null, xp: 0, streak: 0, totalUsers: totalUsers || 0 };
      }

      // Calculate rank by counting leaderboard rows with more XP.
      const { count } = await supabase
        .from("leaderboard")
        .select("*", { count: "exact", head: true })
        .gt("total_xp", user.xp);

      return {
        rank: (count || 0) + 1,
        xp: user.xp,
        streak: user.streak,
        totalUsers: totalUsers || 0,
      };
    }

    return {
      rank: entry.rank,
      xp: entry.total_xp || user?.xp || 0,
      streak: user?.streak || 0,
      totalUsers: totalUsers || 0,
    };
  },

  // Refresh leaderboard (call Supabase function)
  refreshLeaderboard: async () => {
    const { error } = await supabase.rpc("refresh_leaderboard");
    if (error) throw error;
    return { refreshed: true };
  },
};
