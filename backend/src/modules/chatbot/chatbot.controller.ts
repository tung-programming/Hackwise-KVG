import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response";
import { chatbotService } from "./chatbot.service";

export const chatbotController = {
  chat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, maxResults } = req.body as {
        message: string;
        maxResults?: number;
      };

      const result = await chatbotService.ask(message, maxResults);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  stats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = chatbotService.getKnowledgeBaseStats();
      res.json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  },
};

