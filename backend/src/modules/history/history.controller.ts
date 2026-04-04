// History controller
import { Request, Response, NextFunction } from "express";
import { historyService } from "./history.service";
import { ApiResponse } from "../../utils/api-response";

export const historyController = {
  uploadHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const file = req.file;

      if (!file) {
        return res.status(400).json(ApiResponse.error("No file uploaded", 400));
      }

      const result = await historyService.uploadHistory(userId, file);
      // Return 202 Accepted for async processing
      res.status(202).json(ApiResponse.success(result));
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

  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const status = await historyService.getHistoryStatus(userId, id);
      res.json(ApiResponse.success(status));
    } catch (error) {
      next(error);
    }
  },

  deleteHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const result = await historyService.deleteHistory(userId, id);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },
};
