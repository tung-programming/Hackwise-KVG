// Courses routes
import { Router } from "express";
import { coursesController } from "./courses.controller";
import { authGuard } from "../../middleware/auth.guard";

const router = Router();

router.use(authGuard);

router.get("/", coursesController.getCoursesByInterest); // ?interestId=X
router.get("/:id", coursesController.getCourse);
router.patch("/:id/complete", coursesController.completeCourse);

export default router;
