// Onboarding routes
import { Router } from "express";
import { onboardingController } from "./onboarding.controller";
import { authGuard } from "../../middleware/auth.guard";
import { validateRequest } from "../auth/auth.middleware";
import { completeOnboardingSchema } from "./onboarding.schema";

const router = Router();

// Public routes (get field/type options)
router.get("/fields", onboardingController.getFields);
router.get("/types/:field", onboardingController.getTypes);

// Protected routes
router.use(authGuard);
router.get("/status", onboardingController.checkStatus);
router.post("/complete", validateRequest(completeOnboardingSchema), onboardingController.complete);

export default router;
