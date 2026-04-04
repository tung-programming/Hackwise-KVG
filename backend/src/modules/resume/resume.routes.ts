// Resume routes
import { Router } from "express";
import { resumeController } from "./resume.controller";
import { authGuard } from "../../middleware/auth.guard";
import { fileUpload } from "../../middleware/file-upload";
import { validateRequest } from "../auth/auth.middleware";
import { analyzeResumeSchema, atsScoreSchema } from "./resume.schema";

const router = Router();

router.use(authGuard);

// POST /resume/upload - Upload resume file
router.post("/upload", fileUpload.single("resume"), resumeController.uploadResume);

// GET /resume - Get resume info and latest analysis
router.get("/", resumeController.getResume);

// POST /resume/analyze - Analyze resume (optionally against job description)
router.post("/analyze", validateRequest(analyzeResumeSchema), resumeController.analyzeResume);

// POST /resume/ats-score - Get ATS score for specific job description
router.post("/ats-score", validateRequest(atsScoreSchema), resumeController.getATSScore);

// DELETE /resume - Delete resume
router.delete("/", resumeController.deleteResume);

export default router;
