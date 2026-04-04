// Auth routes - Full OAuth implementation
import { Router } from "express";
import { authController } from "./auth.controller";
import { authGuard } from "../../middleware/auth.guard";

const router = Router();

// OAuth initiation routes
router.get("/google", authController.googleAuth);
router.get("/github", authController.githubAuth);

// OAuth callback routes
router.get("/google/callback", authController.googleCallback);
router.get("/github/callback", authController.githubCallback);

// Token management
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Current user (requires JWT)
router.get("/me", authGuard, authController.me);

export default router;
