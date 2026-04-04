// Projects routes
import { Router } from "express";
import { projectsController } from "./projects.controller";
import { authGuard } from "../../middleware/auth.guard";
import { validateRequest } from "../auth/auth.middleware";
import { submitProjectSchema } from "./projects.schema";

const router = Router();

router.use(authGuard);

// GET /projects - Get all user projects
router.get("/", projectsController.getProjects);

// GET /projects/:id - Get single project
router.get("/:id", projectsController.getProject);

// POST /projects/:id/submit - Submit project for validation
router.post("/:id/submit", validateRequest(submitProjectSchema), projectsController.submitProject);

// GET /projects/:id/validation - Get validation result
router.get("/:id/validation", projectsController.getValidation);

export default router;
