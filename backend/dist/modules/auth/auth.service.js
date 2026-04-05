"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
// Auth service - Full OAuth implementation with Supabase
const database_1 = require("../../config/database");
const supabase_js_1 = require("@supabase/supabase-js");
const errors_1 = require("../../utils/errors");
const env_1 = require("../../config/env");
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
// Create a separate client for auth operations (uses anon key for OAuth flows)
const supabaseAuth = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_ANON_KEY);
// Store pending OAuth states in memory (in production, use Redis/DB)
const pendingOAuthStates = new Map();
// PKCE helper functions
function generateCodeVerifier() {
    return crypto.randomBytes(32).toString("base64url");
}
function generateCodeChallenge(verifier) {
    return crypto.createHash("sha256").update(verifier).digest("base64url");
}
exports.authService = {
    // Generate OAuth URL for Google
    getGoogleAuthUrl: (state) => {
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
        const redirectTo = `${env_1.env.BACKEND_URL}/api/auth/google/callback?stateId=${stateId}`;
        // Supabase OAuth URL - PKCE flow with code response type
        const url = new URL(`${env_1.env.SUPABASE_URL}/auth/v1/authorize`);
        url.searchParams.set("provider", "google");
        url.searchParams.set("redirect_to", redirectTo);
        url.searchParams.set("response_type", "code"); // Force code flow, not implicit
        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
        console.log(`Google OAuth URL generated with stateId: ${stateId}`);
        return url.toString();
    },
    // Generate OAuth URL for GitHub
    getGithubAuthUrl: (state) => {
        const stateId = generateStateId();
        // Generate PKCE code verifier and challenge
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        pendingOAuthStates.set(stateId, { ...state, codeVerifier });
        setTimeout(() => pendingOAuthStates.delete(stateId), 10 * 60 * 1000);
        const redirectTo = `${env_1.env.BACKEND_URL}/api/auth/github/callback?stateId=${stateId}`;
        const url = new URL(`${env_1.env.SUPABASE_URL}/auth/v1/authorize`);
        url.searchParams.set("provider", "github");
        url.searchParams.set("redirect_to", redirectTo);
        url.searchParams.set("response_type", "code"); // Force code flow, not implicit
        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
        console.log(`GitHub OAuth URL generated with stateId: ${stateId}`);
        return url.toString();
    },
    // Get stored OAuth state by ID (doesn't consume - allows multiple reads)
    getOAuthState: (stateId) => {
        return pendingOAuthStates.get(stateId);
    },
    // Consume OAuth state (one-time use)
    consumeOAuthState: (stateId) => {
        const state = pendingOAuthStates.get(stateId);
        if (state) {
            pendingOAuthStates.delete(stateId);
        }
        return state;
    },
    // Handle OAuth callback - exchange code for session
    handleOAuthCallback: async (code, stateId, provider) => {
        // Retrieve and consume stored state data
        const stateData = exports.authService.consumeOAuthState(stateId) || {};
        const redirectUrl = stateData.redirectUrl || env_1.env.FRONTEND_URL;
        const codeVerifier = stateData.codeVerifier;
        console.log(`OAuth callback for ${provider}, stateId: ${stateId}, code length: ${code?.length}, hasVerifier: ${!!codeVerifier}`);
        if (!codeVerifier) {
            console.error("Missing code verifier for PKCE");
            throw new errors_1.UnauthorizedError("Invalid OAuth state - missing code verifier");
        }
        // Exchange code for session using Supabase token endpoint with PKCE
        const tokenUrl = `${env_1.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`;
        const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": env_1.env.SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
                auth_code: code,
                code_verifier: codeVerifier,
            }),
        });
        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json().catch(() => ({}));
            console.error("Token exchange error:", errorData);
            throw new errors_1.UnauthorizedError(`OAuth failed: ${errorData.error_description || errorData.error || "Token exchange failed"}`);
        }
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token || !tokenData.user) {
            console.error("Invalid token response:", tokenData);
            throw new errors_1.UnauthorizedError("OAuth failed: Invalid token response");
        }
        console.log("Session obtained, user:", tokenData.user.email);
        const supabaseUser = tokenData.user;
        const providerIdentity = supabaseUser.identities?.find((i) => i.provider === provider);
        // Extract user info
        const email = supabaseUser.email || "";
        const avatarUrl = supabaseUser.user_metadata?.avatar_url ||
            supabaseUser.user_metadata?.picture ||
            null;
        const fullName = supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            "";
        const providerId = providerIdentity?.id || supabaseUser.id;
        // Generate username from email or name
        const username = fullName.toLowerCase().replace(/\s+/g, "_") ||
            email.split("@")[0] ||
            `user_${Date.now()}`;
        // Check if user exists in our users table - try by ID first, then by email
        let { data: existingUser } = await database_1.supabase
            .from("users")
            .select("*")
            .eq("id", supabaseUser.id)
            .single();
        // If not found by ID, check by email (user might exist from previous auth)
        if (!existingUser) {
            const { data: userByEmail } = await database_1.supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single();
            if (userByEmail) {
                console.log("Found existing user by email, updating ID to match Supabase auth");
                // Update the existing user's ID to match Supabase auth ID
                const { data: updatedUser, error: updateError } = await database_1.supabase
                    .from("users")
                    .update({
                    id: supabaseUser.id,
                    avatar_url: avatarUrl || userByEmail.avatar_url,
                    auth_provider: provider,
                    auth_provider_id: providerId,
                    updated_at: new Date().toISOString(),
                })
                    .eq("email", email)
                    .select()
                    .single();
                if (updateError) {
                    console.error("Error updating user ID:", updateError);
                    // If update fails, just use the existing user
                    existingUser = userByEmail;
                }
                else {
                    existingUser = updatedUser;
                }
            }
        }
        let user;
        if (existingUser) {
            console.log("Updating existing user:", existingUser.id);
            // Update existing user (update avatar, last login)
            const { data: updatedUser, error: updateError } = await database_1.supabase
                .from("users")
                .update({
                avatar_url: avatarUrl || existingUser.avatar_url,
                updated_at: new Date().toISOString(),
            })
                .eq("id", existingUser.id)
                .select()
                .single();
            if (updateError) {
                console.error("Update error:", updateError);
                // If update fails, use existing user data
                user = existingUser;
            }
            else {
                user = updatedUser;
            }
        }
        else {
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
                throw new errors_1.UnauthorizedError("Invalid field selection. Please complete onboarding first.");
            }
            // Generate unique username if collision
            let finalUsername = username;
            const { data: existingUsername } = await database_1.supabase
                .from("users")
                .select("username")
                .eq("username", username)
                .single();
            if (existingUsername) {
                finalUsername = `${username}_${Date.now().toString(36)}`;
                console.log("Username collision, using:", finalUsername);
            }
            // Create new user with field/type from state (onboarding data)
            const { data: newUser, error: createError } = await database_1.supabase
                .from("users")
                .insert({
                id: supabaseUser.id,
                email: email,
                username: finalUsername,
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
                // If user already exists (race condition), fetch them by email
                if (createError.code === "23505") {
                    console.log("User exists (duplicate key), fetching by email...");
                    const { data: fetchedUser, error: fetchError } = await database_1.supabase
                        .from("users")
                        .select("*")
                        .eq("email", email)
                        .single();
                    if (fetchError || !fetchedUser) {
                        console.error("Failed to fetch existing user:", fetchError);
                        throw new errors_1.UnauthorizedError("User exists but could not be retrieved. Please try again.");
                    }
                    user = fetchedUser;
                }
                else {
                    console.error("User creation error:", createError);
                    throw createError;
                }
            }
            else {
                user = newUser;
            }
        }
        // Generate our own JWT tokens
        const tokens = exports.authService.generateTokens(user.id, user.email);
        return { user, tokens, redirectUrl };
    },
    // Generate JWT access and refresh tokens
    generateTokens: (userId, email) => {
        const accessToken = jwt.sign({ sub: userId, email, type: "access" }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_ACCESS_EXPIRY });
        const refreshToken = jwt.sign({ sub: userId, email, type: "refresh" }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_REFRESH_EXPIRY });
        // Parse expiry for response
        const expiresIn = parseExpiry(env_1.env.JWT_ACCESS_EXPIRY);
        return { accessToken, refreshToken, expiresIn };
    },
    // Refresh access token using refresh token
    refreshAccessToken: async (refreshToken) => {
        try {
            const decoded = jwt.verify(refreshToken, env_1.env.JWT_SECRET);
            if (decoded.type !== "refresh") {
                throw new errors_1.UnauthorizedError("Invalid token type");
            }
            // Verify user still exists
            const { data: user, error } = await database_1.supabase
                .from("users")
                .select("id, email")
                .eq("id", decoded.sub)
                .single();
            if (error || !user) {
                throw new errors_1.UnauthorizedError("User not found");
            }
            // Generate new tokens
            return exports.authService.generateTokens(user.id, user.email);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new errors_1.UnauthorizedError("Refresh token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Invalid refresh token");
            }
            throw error;
        }
    },
    // Get current user by ID
    getCurrentUser: async (userId) => {
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select(`
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
      `)
            .eq("id", userId)
            .single();
        if (error || !user) {
            throw new errors_1.NotFoundError("User not found");
        }
        return user;
    },
    // Logout - invalidate session (for Supabase session if needed)
    logout: async (accessToken) => {
        // With JWT-based auth, logout is primarily client-side (discard tokens)
        // If using Supabase sessions, we can sign out:
        if (accessToken) {
            try {
                await supabaseAuth.auth.signOut();
            }
            catch (e) {
                // Ignore errors - token may already be invalid
            }
        }
    },
    // Verify access token and return user ID
    verifyAccessToken: (token) => {
        try {
            const decoded = jwt.verify(token, env_1.env.JWT_SECRET);
            if (decoded.type !== "access") {
                throw new errors_1.UnauthorizedError("Invalid token type");
            }
            return { userId: decoded.sub, email: decoded.email };
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new errors_1.UnauthorizedError("Access token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Invalid access token");
            }
            throw error;
        }
    },
};
// Helper to generate random state ID
function generateStateId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36);
}
// Helper to parse expiry string to seconds
function parseExpiry(expiry) {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match)
        return 900; // default 15 minutes
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
//# sourceMappingURL=auth.service.js.map