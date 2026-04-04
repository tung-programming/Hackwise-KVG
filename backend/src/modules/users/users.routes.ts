// Users routes
import { Router } from "express";
import { usersController } from "./users.controller";
import { authGuard } from "../../middleware/auth.guard";
import { validateRequest } from "../auth/auth.middleware";
import { updateProfileSchema } from "./users.schema";

const router = Router();

// Public routes
router.get("/:id/public", usersController.getPublicProfile);

// Protected routes
router.use(authGuard);
router.get("/profile", usersController.getProfile);
router.patch("/profile", validateRequest(updateProfileSchema), usersController.updateProfile);
router.patch("/tour-complete", usersController.completeTour);
router.get("/stats", usersController.getStats);
router.delete("/account", usersController.deleteAccount);

export default router;