// Auth service - Full OAuth implementation with Supabase
import { supabase } from "../../config/database";
import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError, NotFoundError } from "../../utils/errors";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";

// Create a separate client for auth operations (uses anon key for OAuth flows)
const supabaseAuth = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

interface OAuthState {
  field?: string;
  type?: string;
  redirectUrl?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  field: string | null;
  type: string | null;
  auth_provider: string;
  auth_provider_id: string;
}

export const authService = {
  // Generate OAuth URL for Google
  getGoogleAuthUrl: (state: OAuthState): string => {
    const stateParam = Buffer.from(JSON.stringify(state)).toString("base64");
    const redirectTo = `${env.BACKEND_URL}/api/auth/google/callback`;

    // Supabase OAuth URL
    const url = new URL(`${env.SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set("provider", "google");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("state", stateParam);

    return url.toString();
  },

  // Generate OAuth URL for GitHub
  getGithubAuthUrl: (state: OAuthState): string => {
    const stateParam = Buffer.from(JSON.stringify(state)).toString("base64");
    const redirectTo = `${env.BACKEND_URL}/api/auth/github/callback`;

    const url = new URL(`${env.SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set("provider", "github");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("state", stateParam);

    return url.toString();
  },

  // Handle OAuth callback - exchange code for session
  handleOAuthCallback: async (
    code: string,
    state: string,
    provider: "google" | "github"
  ): Promise<{ user: UserData; tokens: TokenPair }> => {
    // Decode state parameter
    let stateData: OAuthState = {};
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
    } catch (e) {
      console.warn("Failed to decode state parameter");
    }

    // Exchange code for session with Supabase
    const { data: sessionData, error: sessionError } =
      await supabaseAuth.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.session) {
      throw new UnauthorizedError(
        `OAuth failed: ${sessionError?.message || "No session returned"}`
      );
    }

    const supabaseUser = sessionData.user;
    const providerIdentity = supabaseUser.identities?.find(
      (i) => i.provider === provider
    );

    // Extract user info
    const email = supabaseUser.email || "";
    const avatarUrl =
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      null;
    const fullName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      "";
    const providerId = providerIdentity?.id || supabaseUser.id;

    // Generate username from email or name
    const username =
      fullName.toLowerCase().replace(/\s+/g, "_") ||
      email.split("@")[0] ||
      `user_${Date.now()}`;

    // Check if user exists in our users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    let user: UserData;

    if (existingUser) {
      // Update existing user (update avatar, last login)
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          avatar_url: avatarUrl || existingUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", supabaseUser.id)
        .select()
        .single();

      if (updateError) throw updateError;
      user = updatedUser;
    } else {
      // Create new user with field/type from state (onboarding data)
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: supabaseUser.id,
          email: email,
          username: username,
          avatar_url: avatarUrl,
          field: stateData.field || null,
          type: stateData.type || null,
          auth_provider: provider,
          auth_provider_id: providerId,
          xp: 0,
          streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        // If user already exists (race condition), fetch them
        if (createError.code === "23505") {
          const { data: fetchedUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();
          user = fetchedUser!;
        } else {
          throw createError;
        }
      } else {
        user = newUser;
      }
    }

    // Generate our own JWT tokens
    const tokens = authService.generateTokens(user.id, user.email);

    return { user, tokens };
  },

  // Generate JWT access and refresh tokens
  generateTokens: (userId: string, email: string): TokenPair => {
    const accessToken = jwt.sign(
      { sub: userId, email, type: "access" },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { sub: userId, email, type: "refresh" },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );

    // Parse expiry for response
    const expiresIn = parseExpiry(env.JWT_ACCESS_EXPIRY);

    return { accessToken, refreshToken, expiresIn };
  },

  // Refresh access token using refresh token
  refreshAccessToken: async (refreshToken: string): Promise<TokenPair> => {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as {
        sub: string;
        email: string;
        type: string;
      };

      if (decoded.type !== "refresh") {
        throw new UnauthorizedError("Invalid token type");
      }

      // Verify user still exists
      const { data: user, error } = await supabase
        .from("users")
        .select("id, email")
        .eq("id", decoded.sub)
        .single();

      if (error || !user) {
        throw new UnauthorizedError("User not found");
      }

      // Generate new tokens
      return authService.generateTokens(user.id, user.email);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Refresh token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token");
      }
      throw error;
    }
  },

  // Get current user by ID
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

  // Logout - invalidate session (for Supabase session if needed)
  logout: async (accessToken?: string): Promise<void> => {
    // With JWT-based auth, logout is primarily client-side (discard tokens)
    // If using Supabase sessions, we can sign out:
    if (accessToken) {
      try {
        await supabaseAuth.auth.signOut();
      } catch (e) {
        // Ignore errors - token may already be invalid
      }
    }
  },

  // Verify access token and return user ID
  verifyAccessToken: (token: string): { userId: string; email: string } => {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        sub: string;
        email: string;
        type: string;
      };

      if (decoded.type !== "access") {
        throw new UnauthorizedError("Invalid token type");
      }

      return { userId: decoded.sub, email: decoded.email };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Access token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid access token");
      }
      throw error;
    }
  },
};

// Helper to parse expiry string to seconds
function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      return 900;
  }
}
