"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const api_response_1 = require("../../utils/api-response");
const env_1 = require("../../config/env");
// Cookie options for refresh token
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env_1.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
};
// Helper to get redirect URL from stateId
const getRedirectUrl = (stateId) => {
    if (stateId) {
        const state = auth_service_1.authService.getOAuthState(stateId);
        return state?.redirectUrl || env_1.env.FRONTEND_URL;
    }
    return env_1.env.FRONTEND_URL;
};
exports.authController = {
    // GET /api/auth/google - Initiate Google OAuth
    googleAuth: async (req, res, next) => {
        try {
            const { field, type, redirect_url } = req.query;
            const authUrl = auth_service_1.authService.getGoogleAuthUrl({
                field: field,
                type: type,
                redirectUrl: redirect_url || env_1.env.FRONTEND_URL,
            });
            res.redirect(authUrl);
        }
        catch (error) {
            next(error);
        }
    },
    // GET /api/auth/google/callback - Handle Google OAuth callback
    googleCallback: async (req, res, next) => {
        try {
            const { code, stateId, error, error_description } = req.query;
            const redirectUrl = getRedirectUrl(stateId);
            // Check for errors from Supabase OAuth
            if (error) {
                console.error("Google OAuth error from Supabase:", error, error_description);
                return res.redirect(`${redirectUrl}/callback?error=${encodeURIComponent(error_description || error || "Authentication failed")}`);
            }
            if (!code || typeof code !== "string") {
                return res.redirect(`${redirectUrl}/callback?error=${encodeURIComponent("No authorization code received")}`);
            }
            const { user, tokens, redirectUrl: finalRedirectUrl } = await auth_service_1.authService.handleOAuthCallback(code, stateId || "", "google");
            // Set refresh token as httpOnly cookie
            res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            // Redirect to frontend with access token
            const callbackUrl = new URL(`${finalRedirectUrl}/callback`);
            callbackUrl.searchParams.set("access_token", tokens.accessToken);
            callbackUrl.searchParams.set("expires_in", tokens.expiresIn.toString());
            callbackUrl.searchParams.set("user_id", user.id);
            // If user needs onboarding (no field set), indicate that
            if (!user.field) {
                callbackUrl.searchParams.set("needs_onboarding", "true");
            }
            res.redirect(callbackUrl.toString());
        }
        catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect(`${env_1.env.FRONTEND_URL}/callback?error=${encodeURIComponent(error.message || "Authentication failed")}`);
        }
    },
    // GET /api/auth/github - Initiate GitHub OAuth
    githubAuth: async (req, res, next) => {
        try {
            const { field, type, redirect_url } = req.query;
            const authUrl = auth_service_1.authService.getGithubAuthUrl({
                field: field,
                type: type,
                redirectUrl: redirect_url || env_1.env.FRONTEND_URL,
            });
            res.redirect(authUrl);
        }
        catch (error) {
            next(error);
        }
    },
    // GET /api/auth/github/callback - Handle GitHub OAuth callback
    githubCallback: async (req, res, next) => {
        try {
            const { code, stateId, error, error_description } = req.query;
            const redirectUrl = getRedirectUrl(stateId);
            // Check for errors from Supabase OAuth
            if (error) {
                console.error("GitHub OAuth error from Supabase:", error, error_description);
                return res.redirect(`${redirectUrl}/callback?error=${encodeURIComponent(error_description || error || "Authentication failed")}`);
            }
            if (!code || typeof code !== "string") {
                return res.redirect(`${redirectUrl}/callback?error=${encodeURIComponent("No authorization code received")}`);
            }
            const { user, tokens, redirectUrl: finalRedirectUrl } = await auth_service_1.authService.handleOAuthCallback(code, stateId || "", "github");
            // Set refresh token as httpOnly cookie
            res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            // Redirect to frontend with access token
            const callbackUrl = new URL(`${finalRedirectUrl}/callback`);
            callbackUrl.searchParams.set("access_token", tokens.accessToken);
            callbackUrl.searchParams.set("expires_in", tokens.expiresIn.toString());
            callbackUrl.searchParams.set("user_id", user.id);
            if (!user.field) {
                callbackUrl.searchParams.set("needs_onboarding", "true");
            }
            res.redirect(callbackUrl.toString());
        }
        catch (error) {
            console.error("GitHub OAuth callback error:", error);
            res.redirect(`${env_1.env.FRONTEND_URL}/callback?error=${encodeURIComponent(error.message || "Authentication failed")}`);
        }
    },
    // GET /api/auth/me - Get current authenticated user
    me: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await auth_service_1.authService.getCurrentUser(userId);
            res.json(api_response_1.ApiResponse.success(user));
        }
        catch (error) {
            next(error);
        }
    },
    // POST /api/auth/refresh - Refresh access token
    refresh: async (req, res, next) => {
        try {
            // Get refresh token from cookie or body
            const refreshToken = req.cookies?.refresh_token || req.body?.refresh_token;
            if (!refreshToken) {
                return res
                    .status(401)
                    .json(api_response_1.ApiResponse.error("Refresh token required", 401));
            }
            const tokens = await auth_service_1.authService.refreshAccessToken(refreshToken);
            // Update refresh token cookie
            res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.json(api_response_1.ApiResponse.success({
                access_token: tokens.accessToken,
                expires_in: tokens.expiresIn,
                token_type: "Bearer",
            }));
        }
        catch (error) {
            next(error);
        }
    },
    // POST /api/auth/logout - Logout user
    logout: async (req, res, next) => {
        try {
            // Clear refresh token cookie
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
            // Sign out from Supabase if we have a token
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                await auth_service_1.authService.logout(token);
            }
            res.json(api_response_1.ApiResponse.success({ message: "Logged out successfully" }));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map