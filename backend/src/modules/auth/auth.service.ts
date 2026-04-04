// Auth service - Supabase handles OAuth, this manages user data
import { supabase } from "../../config/database";
import { UnauthorizedError, NotFoundError } from "../../utils/errors";

export const authService = {
  getCurrentUser: async (userId: string) => {
    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        username,
        avatar_url,
        field,
        type,
        xp,
        streak,
        leaderboard_pos,
        resume_score,
        created_at
      `
      )
      .eq("id", userId)
      .single();

    if (error || !user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  // Check if user exists, if not create from Supabase auth
  ensureUser: async (authUser: { id: string; email: string }) => {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // User doesn't exist in our users table, they need to complete onboarding
    return null;
  },

  // Get user by auth provider ID (for looking up after OAuth)
  getUserByAuthProvider: async (provider: string, providerId: string) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_provider", provider)
      .eq("auth_provider_id", providerId)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  },
};
