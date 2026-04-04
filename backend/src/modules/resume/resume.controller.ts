// Resume controller
import { Request, Response, NextFunction } from "express";
import { resumeService } from "./resume.service";
import { ApiResponse } from "../../utils/api-response";

export const resumeController = {
  // POST /resume/upload - Upload resume
  uploadResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const file = req.file;

      if (!file) {
        return res.status(400).json(ApiResponse.error("Resume file is required", 400));
      }

      const result = await resumeService.uploadResume(userId, file);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  // GET /resume - Get resume info
  getResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const resume = await resumeService.getResume(userId);
      res.json(ApiResponse.success(resume));
    } catch (error) {
      next(error);
    }
  },

  // POST /resume/analyze - Analyze resume
  analyzeResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { job_description } = req.body;
      const analysis = await resumeService.analyzeResume(userId, job_description);
      res.json(ApiResponse.success(analysis));
    } catch (error) {
      next(error);
    }
  },

  // POST /resume/ats-score - Get ATS score for specific job
  getATSScore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { job_description } = req.body;

      if (!job_description) {
        return res.status(400).json(ApiResponse.error("job_description is required", 400));
      }

      const score = await resumeService.getATSScore(userId, job_description);
      res.json(ApiResponse.success(score));
    } catch (error) {
      next(error);
    }
  },

  // DELETE /resume - Delete resume
  deleteResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await resumeService.deleteResume(userId);
      res.json(ApiResponse.success({ message: "Resume deleted" }));
    } catch (error) {
      next(error);
    }
  },
};
