// Resume Analysis Controller
import { Request, Response, NextFunction } from "express";
import { resumeAnalysisService } from "./resume-analysis.service";
import { ApiResponse } from "../../utils/api-response";

export const resumeAnalysisController = {
  /**
   * POST /resume-analysis/upload - Upload and analyze resume
   */
  uploadAndAnalyze: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const file = req.file;
      const { job_description } = req.body;

      if (!file) {
        return res.status(400).json(ApiResponse.error("Resume file is required", 400));
      }

      const result = await resumeAnalysisService.uploadAndAnalyze(
        userId,
        file,
        job_description
      );

      res.json(
        ApiResponse.success({
          message: "Resume analyzed successfully",
          ...result,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /resume-analysis - Get user's resume analysis
   */
  getAnalysis: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const analysis = await resumeAnalysisService.getAnalysis(userId);
      res.json(ApiResponse.success(analysis));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /resume-analysis/re-analyze - Re-analyze existing resume
   */
  reAnalyze: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { job_description } = req.body;

      const result = await resumeAnalysisService.reAnalyze(userId, job_description);

      res.json(
        ApiResponse.success({
          message: "Resume re-analyzed successfully",
          ...result,
        })
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /resume-analysis/suggestions - Get suggestions for job description
   */
  getSuggestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { job_description } = req.body;

      if (!job_description) {
        return res
          .status(400)
          .json(ApiResponse.error("job_description is required", 400));
      }

      const suggestions = await resumeAnalysisService.getSuggestions(
        userId,
        job_description
      );

      res.json(ApiResponse.success(suggestions));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /resume-analysis - Delete resume analysis
   */
  deleteAnalysis: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await resumeAnalysisService.deleteAnalysis(userId);
      res.json(ApiResponse.success({ message: "Resume analysis deleted" }));
    } catch (error) {
      next(error);
    }
  },
};
