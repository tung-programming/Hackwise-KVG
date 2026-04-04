// History controller
import { Request, Response, NextFunction } from 'express';
import { historyService } from './history.service';
import { ApiResponse } from '../../utils/api-response';

export const historyController = {
  uploadHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const file = req.file;
      const result = await historyService.processUpload(userId, file!);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  getHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20 } = req.query;
      const history = await historyService.getHistory(
        userId,
        Number(page),
        Number(limit)
      );
      res.json(ApiResponse.success(history));
    } catch (error) {
      next(error);
    }
  },

  analyzeHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const analysis = await historyService.analyzeHistory(userId);
      res.json(ApiResponse.success(analysis));
    } catch (error) {
      next(error);
    }
  },

  clearHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await historyService.clearHistory(userId);
      res.json(ApiResponse.success({ message: 'History cleared' }));
    } catch (error) {
      next(error);
    }
  },
};
