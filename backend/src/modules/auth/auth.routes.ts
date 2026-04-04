// Auth routes - Supabase handles OAuth, minimal routes here
import { Router } from "express";
import { authController } from "./auth.controller";
import { authGuard } from "../../middleware/auth.guard";

const router = Router();

// Current user (requires Supabase JWT)
router.get("/me", authGuard, authController.me);

// Logout (client-side handles Supabase signout, this is optional backend cleanup)
router.post("/logout", authGuard, authController.logout);

export default router;
