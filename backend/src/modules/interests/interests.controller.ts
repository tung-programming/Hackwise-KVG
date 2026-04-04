// Interests controller
import { Request, Response, NextFunction } from 'express';
import { interestsService } from './interests.service';
import { ApiResponse } from '../../utils/api-response';

export const interestsController = {
  getInterests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const interests = await interestsService.getUserInterests(userId);
      res.json(ApiResponse.success(interests));
    } catch (error) {
      next(error);
    }
  },

  addInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { name, category } = req.body;
      const interest = await interestsService.addInterest(userId, name, category);
      res.json(ApiResponse.success(interest));
    } catch (error) {
      next(error);
    }
  },

  removeInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { interestId } = req.params;
      await interestsService.removeInterest(userId, interestId);
      res.json(ApiResponse.success({ message: 'Interest removed' }));
    } catch (error) {
      next(error);
    }
  },

  getRecommendations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const recommendations = await interestsService.getRecommendations(userId);
      res.json(ApiResponse.success(recommendations));
    } catch (error) {
      next(error);
    }
  },

  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await interestsService.getAllCategories();
      res.json(ApiResponse.success(categories));
    } catch (error) {
      next(error);
    }
  },
};
