// Interests routes
import { Router } from "express";
import { interestsController } from "./interests.controller";
import { authGuard } from "../../middleware/auth.guard";

const router = Router();

router.use(authGuard);

router.get("/", interestsController.getInterests);
router.get("/:id", interestsController.getInterest);
router.patch("/:id/accept", interestsController.acceptInterest);
router.patch("/:id/reject", interestsController.rejectInterest);
router.get("/:id/progress", interestsController.getProgress);

export default router;
