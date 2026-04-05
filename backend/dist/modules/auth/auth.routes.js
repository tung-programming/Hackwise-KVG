"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Auth routes - Full OAuth implementation
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const router = (0, express_1.Router)();
// OAuth initiation routes
router.get("/google", auth_controller_1.authController.googleAuth);
router.get("/github", auth_controller_1.authController.githubAuth);
// OAuth callback routes
router.get("/google/callback", auth_controller_1.authController.googleCallback);
router.get("/github/callback", auth_controller_1.authController.githubCallback);
// Token management
router.post("/refresh", auth_controller_1.authController.refresh);
router.post("/logout", auth_controller_1.authController.logout);
// Current user (requires JWT)
router.get("/me", auth_guard_1.authGuard, auth_controller_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map