// Resume controller
import { Request, Response, NextFunction } from 'express';
import { resumeService } from './resume.service';
import { ApiResponse } from '../../utils/api-response';

export const resumeController = {
  uploadResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const file = req.file;
      const result = await resumeService.uploadResume(userId, file!);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  getResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const resume = await resumeService.getResume(userId);
      res.json(ApiResponse.success(resume));
    } catch (error) {
      next(error);
    }
  },

  analyzeResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { jobDescription } = req.body;
      const analysis = await resumeService.analyzeResume(userId, jobDescription);
      res.json(ApiResponse.success(analysis));
    } catch (error) {
      next(error);
    }
  },

  getATSScore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { jobDescription } = req.body;
      const score = await resumeService.getATSScore(userId, jobDescription);
      res.json(ApiResponse.success(score));
    } catch (error) {
      next(error);
    }
  },

  deleteResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await resumeService.deleteResume(userId);
      res.json(ApiResponse.success({ message: 'Resume deleted' }));
    } catch (error) {
      next(error);
    }
  },
};
