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

export const authController = {
  // GET /api/auth/google - Initiate Google OAuth
  googleAuth: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { field, type, redirect_url } = req.query;

      const authUrl = authService.getGoogleAuthUrl({
        field: field as string,
        type: type as string,
        redirectUrl: redirect_url as string,
      });

      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/google/callback - Handle Google OAuth callback
  googleCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query;

      if (!code || typeof code !== "string") {
        return res.redirect(
          `${env.FRONTEND_URL}/auth/error?message=No authorization code received`
        );
      }

      const { user, tokens } = await authService.handleOAuthCallback(
        code,
        (state as string) || "",
        "google"
      );

      // Set refresh token as httpOnly cookie
      res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      // Decode state for redirect URL
      let redirectUrl = env.FRONTEND_URL;
      if (state) {
        try {
          const stateData = JSON.parse(
            Buffer.from(state as string, "base64").toString("utf-8")
          );
          if (stateData.redirectUrl) {
            redirectUrl = stateData.redirectUrl;
          }
        } catch (e) {
          // Use default redirect
        }
      }

      // Redirect to frontend with access token
      const callbackUrl = new URL(`${redirectUrl}/auth/callback`);
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
        `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(
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
        redirectUrl: redirect_url as string,
      });

      res.redirect(authUrl);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/github/callback - Handle GitHub OAuth callback
  githubCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query;

      if (!code || typeof code !== "string") {
        return res.redirect(
          `${env.FRONTEND_URL}/auth/error?message=No authorization code received`
        );
      }

      const { user, tokens } = await authService.handleOAuthCallback(
        code,
        (state as string) || "",
        "github"
      );

      // Set refresh token as httpOnly cookie
      res.cookie("refresh_token", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      // Decode state for redirect URL
      let redirectUrl = env.FRONTEND_URL;
      if (state) {
        try {
          const stateData = JSON.parse(
            Buffer.from(state as string, "base64").toString("utf-8")
          );
          if (stateData.redirectUrl) {
            redirectUrl = stateData.redirectUrl;
          }
        } catch (e) {
          // Use default redirect
        }
      }

      // Redirect to frontend with access token
      const callbackUrl = new URL(`${redirectUrl}/auth/callback`);
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
        `${env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(
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
