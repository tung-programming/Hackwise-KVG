// Onboarding controller
import { Request, Response, NextFunction } from 'express';
import { onboardingService } from './onboarding.service';
import { ApiResponse } from '../../utils/api-response';

export const onboardingController = {
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const status = await onboardingService.getStatus(userId);
      res.json(ApiResponse.success(status));
    } catch (error) {
      next(error);
    }
  },

  submitStep: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { step, data } = req.body;
      const result = await onboardingService.submitStep(userId, step, data);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  complete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const result = await onboardingService.complete(userId);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  skip: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const result = await onboardingService.skip(userId);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },
};
