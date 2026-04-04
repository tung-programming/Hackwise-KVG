// Auth controller - Full OAuth implementation
import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/api-response";
import { env } from "../../config/env";

// Cookie options for refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// Helper to get redirect URL from stateId
const getRedirectUrl = (stateId: string | undefined): string => {
  if (stateId) {
    const state = authService.getOAuthState(stateId as string);
    return state?.redirectUrl || env.FRONTEND_URL;
  }
  return env.FRONTEND_URL;
};

export const authController = {
  // GET /api/auth/google - Initiate Google OAuth
  googleAuth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { field, type, redirect_url } = req.query;

      const authUrl = authService.getGoogleAuthUrl({
        field: field as string,
        type: type as string,
        redirectUrl: (redirect_url as string) || env.FRONTEND_URL,
      });

      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/google/callback - Handle Google OAuth callback
  googleCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, stateId, error, error_description } = req.query;
      const redirectUrl = getRedirectUrl(stateId as string);

      // Check for errors from Supabase OAuth
      if (error) {
        console.error("Google OAuth error from Supabase:", error, error_description);
        return res.redirect(
          `${redirectUrl}/callback?error=${encodeURIComponent(
            (error_description as string) || (error as string) || "Authentication failed"
          )}`
        );
      }

      if (!code || typeof code !== "string") {
        return res.redirect(
          `${redirectUrl}/callback?error=${encodeURIComponent("No authorization code received")}`
        );
      }

      const { user, tokens, redirectUrl: finalRedirectUrl } = await authService.handleOAuthCallback(
        code,
        (stateId as string) || "",
        "google"
      );

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
    } catch (error: any) {
      console.error("Google OAuth callback error:", error);
      res.redirect(
        `${env.FRONTEND_URL}/callback?error=${encodeURIComponent(
          error.message || "Authentication failed"
        )}`
      );
    }
  },

  // GET /api/auth/github - Initiate GitHub OAuth
  githubAuth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { field, type, redirect_url } = req.query;

      const authUrl = authService.getGithubAuthUrl({
        field: field as string,
        type: type as string,
        redirectUrl: (redirect_url as string) || env.FRONTEND_URL,
      });

      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/github/callback - Handle GitHub OAuth callback
  githubCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, stateId, error, error_description } = req.query;
      const redirectUrl = getRedirectUrl(stateId as string);

      // Check for errors from Supabase OAuth
      if (error) {
        console.error("GitHub OAuth error from Supabase:", error, error_description);
        return res.redirect(
          `${redirectUrl}/callback?error=${encodeURIComponent(
            (error_description as string) || (error as string) || "Authentication failed"
          )}`
        );
      }

      if (!code || typeof code !== "string") {
        return res.redirect(
          `${redirectUrl}/callback?error=${encodeURIComponent("No authorization code received")}`
        );
      }

      const { user, tokens, redirectUrl: finalRedirectUrl } = await authService.handleOAuthCallback(
        code,
        (stateId as string) || "",
        "github"
      );

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
    } catch (error: any) {
      console.error("GitHub OAuth callback error:", error);
      res.redirect(
        `${env.FRONTEND_URL}/callback?error=${encodeURIComponent(
          error.message || "Authentication failed"
        )}`
      );
    }
  },

  // GET /api/auth/me - Get current authenticated user
  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await authService.getCurrentUser(userId);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/refresh - Refresh access token
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get refresh token from cookie or body
      const refreshToken =
        req.cookies?.refresh_token || req.body?.refresh_token;

      if (!refreshToken) {
        return res
          .status(401)
          .json(ApiResponse.error("Refresh token required", 401));
      }

      const tokens = await authService.refreshAccessToken(refreshToken);

      // Update refresh token cookie
      res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json(
        ApiResponse.success({
          access_token: tokens.accessToken,
          expires_in: tokens.expiresIn,
          token_type: "Bearer",
        })
      );
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout - Logout user
  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear refresh token cookie
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // Sign out from Supabase if we have a token
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        await authService.logout(token);
      }

      res.json(ApiResponse.success({ message: "Logged out successfully" }));
    } catch (error) {
      next(error);
    }
  },
};
