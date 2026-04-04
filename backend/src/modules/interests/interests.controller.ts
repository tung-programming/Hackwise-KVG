// Interests controller
import { Request, Response, NextFunction } from "express";
import { interestsService } from "./interests.service";
import { ApiResponse } from "../../utils/api-response";

export const interestsController = {
  // Get all interests for current user
  getInterests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const interests = await interestsService.getUserInterests(userId);
      res.json(ApiResponse.success(interests));
    } catch (error) {
      next(error);
    }
  },

  // Get single interest with courses and projects
  getInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const interest = await interestsService.getInterest(userId, id);
      res.json(ApiResponse.success(interest));
    } catch (error) {
      next(error);
    }
  },

  // Accept interest - triggers roadmap generation
  acceptInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const result = await interestsService.acceptInterest(userId, id);
      // Return 202 for async processing
      res.status(202).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  // Reject interest
  rejectInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const interest = await interestsService.rejectInterest(userId, id);
      res.json(ApiResponse.success(interest));
    } catch (error) {
      next(error);
    }
  },

  // Get progress for an interest
  getProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const progress = await interestsService.getProgress(userId, id);
      res.json(ApiResponse.success(progress));
    } catch (error) {
      next(error);
    }
  },
};
