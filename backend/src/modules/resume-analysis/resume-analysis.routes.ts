// Resume Analysis Routes
import { Router } from "express";
import { resumeAnalysisController } from "./resume-analysis.controller";
import { authGuard } from "../../middleware/auth.guard";
import { resumeFileUpload } from "./file-upload.middleware";
import { validateRequest } from "../auth/auth.middleware";
import { reAnalyzeSchema, suggestionsSchema } from "./resume-analysis.schema";

const router = Router();

// All routes require authentication
router.use(authGuard);

/**
 * POST /resume-analysis/upload
 * Upload resume (PDF/Image), extract text via Gemini OCR, and analyze
 */
router.post(
  "/upload",
  resumeFileUpload.single("resume"),
  resumeAnalysisController.uploadAndAnalyze
);

/**
 * GET /resume-analysis
 * Get user's current resume analysis
 */
router.get("/", resumeAnalysisController.getAnalysis);

/**
 * POST /resume-analysis/re-analyze
 * Re-analyze existing resume (optionally with new job description)
 */
router.post(
  "/re-analyze",
  validateRequest(reAnalyzeSchema),
  resumeAnalysisController.reAnalyze
);

/**
 * POST /resume-analysis/suggestions
 * Get tailored suggestions for a specific job description
 */
router.post(
  "/suggestions",
  validateRequest(suggestionsSchema),
  resumeAnalysisController.getSuggestions
);

/**
 * DELETE /resume-analysis
 * Delete user's resume and analysis
 */
router.delete("/", resumeAnalysisController.deleteAnalysis);

export default router;
