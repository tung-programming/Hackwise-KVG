// Auth service - Full OAuth implementation with Supabase
import { supabase } from "../../config/database";
import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError, NotFoundError } from "../../utils/errors";
import { env } from "../../config/env";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

// Create a separate client for auth operations (uses anon key for OAuth flows)
const supabaseAuth = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

interface OAuthState {
  field?: string;
  type?: string;
  redirectUrl?: string;
  codeVerifier?: string; // PKCE code verifier
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

// Store pending OAuth states in memory (in production, use Redis/DB)
const pendingOAuthStates = new Map<string, OAuthState>();

// PKCE helper functions
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export const authService = {
  // Generate OAuth URL for Google
  getGoogleAuthUrl: (state: OAuthState): string => {
    // Generate a random state ID to store our custom data
    const stateId = generateStateId();
    
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    
    // Store state with code verifier for later verification
    pendingOAuthStates.set(stateId, { ...state, codeVerifier });
    
    // Clean up old states after 10 minutes
    setTimeout(() => pendingOAuthStates.delete(stateId), 10 * 60 * 1000);

    // The redirect goes back to our backend callback
    const redirectTo = `${env.BACKEND_URL}/api/auth/google/callback?stateId=${stateId}`;

    // Supabase OAuth URL - PKCE flow with code response type
    const url = new URL(`${env.SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set("provider", "google");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("response_type", "code"); // Force code flow, not implicit
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");

    console.log(`Google OAuth URL generated with stateId: ${stateId}`);
    return url.toString();
  },

  // Generate OAuth URL for GitHub
  getGithubAuthUrl: (state: OAuthState): string => {
    const stateId = generateStateId();
    
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    
    pendingOAuthStates.set(stateId, { ...state, codeVerifier });
    
    setTimeout(() => pendingOAuthStates.delete(stateId), 10 * 60 * 1000);

    const redirectTo = `${env.BACKEND_URL}/api/auth/github/callback?stateId=${stateId}`;

    const url = new URL(`${env.SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set("provider", "github");
    url.searchParams.set("redirect_to", redirectTo);
    url.searchParams.set("response_type", "code"); // Force code flow, not implicit
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");

    console.log(`GitHub OAuth URL generated with stateId: ${stateId}`);
    return url.toString();
  },

  // Get stored OAuth state by ID (doesn't consume - allows multiple reads)
  getOAuthState: (stateId: string): OAuthState | undefined => {
    return pendingOAuthStates.get(stateId);
  },

  // Consume OAuth state (one-time use)
  consumeOAuthState: (stateId: string): OAuthState | undefined => {
    const state = pendingOAuthStates.get(stateId);
    if (state) {
      pendingOAuthStates.delete(stateId);
    }
    return state;
  },

  // Handle OAuth callback - exchange code for session
  handleOAuthCallback: async (
    code: string,
    stateId: string,
    provider: "google" | "github"
  ): Promise<{ user: UserData; tokens: TokenPair; redirectUrl: string }> => {
    // Retrieve and consume stored state data
    const stateData: OAuthState = authService.consumeOAuthState(stateId) || {};
    const redirectUrl = stateData.redirectUrl || env.FRONTEND_URL;
    const codeVerifier = stateData.codeVerifier;

    console.log(`OAuth callback for ${provider}, stateId: ${stateId}, code length: ${code?.length}, hasVerifier: ${!!codeVerifier}`);

    if (!codeVerifier) {
      console.error("Missing code verifier for PKCE");
      throw new UnauthorizedError("Invalid OAuth state - missing code verifier");
    }

    // Exchange code for session using Supabase token endpoint with PKCE
    const tokenUrl = `${env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`;
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": env.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("Token exchange error:", errorData);
      throw new UnauthorizedError(
        `OAuth failed: ${errorData.error_description || errorData.error || "Token exchange failed"}`
      );
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token || !tokenData.user) {
      console.error("Invalid token response:", tokenData);
      throw new UnauthorizedError("OAuth failed: Invalid token response");
    }

    console.log("Session obtained, user:", tokenData.user.email);

    const supabaseUser = tokenData.user;
    const providerIdentity = supabaseUser.identities?.find(
      (i: any) => i.provider === provider
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
      console.log("Updating existing user:", existingUser.id);
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
      console.log("Creating new user for:", email);
      
      // Normalize field and type to lowercase (database constraint requires lowercase)
      // Valid fields: 'engineering', 'business', 'law', 'medical'
      const normalizedField = stateData.field?.toLowerCase() || null;
      const normalizedType = stateData.type?.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and') || null;
      
      // Validate field value
      const validFields = ['engineering', 'business', 'law', 'medical'];
      const fieldValue = normalizedField && validFields.includes(normalizedField) ? normalizedField : null;
      
      if (!fieldValue) {
        console.error("Invalid or missing field value:", stateData.field);
        throw new UnauthorizedError("Invalid field selection. Please complete onboarding first.");
      }
      
      // Create new user with field/type from state (onboarding data)
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: supabaseUser.id,
          email: email,
          username: username,
          avatar_url: avatarUrl,
          field: fieldValue,
          type: normalizedType || 'general',
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
          console.log("User exists (race condition), fetching...");
          const { data: fetchedUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();
          user = fetchedUser!;
        } else {
          console.error("User creation error:", createError);
          throw createError;
        }
      } else {
        user = newUser;
      }
    }

    // Generate our own JWT tokens
    const tokens = authService.generateTokens(user.id, user.email);

    return { user, tokens, redirectUrl };
  },

  // Generate JWT access and refresh tokens
  generateTokens: (userId: string, email: string): TokenPair => {
    const accessToken = jwt.sign(
      { sub: userId, email, type: "access" },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"] }
    );

    const refreshToken = jwt.sign(
      { sub: userId, email, type: "refresh" },
      env.JWT_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"] }
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

// Helper to generate random state ID
function generateStateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

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
