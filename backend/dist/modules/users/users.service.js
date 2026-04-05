"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
// Users service
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
exports.usersService = {
    getProfile: async (userId) => {
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error || !user) {
            throw new errors_1.NotFoundError("User not found");
        }
        // Get interests count
        const { count: interestsCount } = await database_1.supabase
            .from("interests")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
        // Get completed courses count
        const { count: coursesCount } = await database_1.supabase
            .from("courses")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_completed", true);
        // Get completed projects count
        const { count: projectsCount } = await database_1.supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_completed", true);
        return {
            ...user,
            interests_count: interestsCount || 0,
            courses_completed: coursesCount || 0,
            projects_completed: projectsCount || 0,
        };
    },
    updateProfile: async (userId, data) => {
        const { data: user, error } = await database_1.supabase
            .from("users")
            .update({
            username: data.username,
            avatar_url: data.avatar_url,
            updated_at: new Date().toISOString(),
        })
            .eq("id", userId)
            .select()
            .single();
        if (error) {
            throw error;
        }
        return user;
    },
    getStats: async (userId) => {
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select("xp, streak, leaderboard_pos")
            .eq("id", userId)
            .single();
        if (error || !user) {
            throw new errors_1.NotFoundError("User not found");
        }
        // Get completed courses count
        const { count: coursesCompleted } = await database_1.supabase
            .from("courses")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_completed", true);
        // Get completed projects count
        const { count: projectsCompleted } = await database_1.supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_completed", true);
        // Get accepted interests count
        const { count: interestsAccepted } = await database_1.supabase
            .from("interests")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("status", "accepted");
        return {
            xp: user.xp,
            streak: user.streak,
            leaderboard_pos: user.leaderboard_pos,
            courses_completed: coursesCompleted || 0,
            projects_completed: projectsCompleted || 0,
            interests_accepted: interestsAccepted || 0,
        };
    },
    getPublicProfile: async (userId) => {
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select("id, username, avatar_url, field, type, xp, streak, leaderboard_pos")
            .eq("id", userId)
            .single();
        if (error || !user) {
            throw new errors_1.NotFoundError("User not found");
        }
        return user;
    },
    deleteAccount: async (userId) => {
        const { error } = await database_1.supabase.from("users").delete().eq("id", userId);
        if (error) {
            throw error;
        }
    },
};
//# sourceMappingURL=users.service.js.map