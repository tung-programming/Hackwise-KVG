// Onboarding controller
import { Request, Response, NextFunction } from "express";
import { onboardingService } from "./onboarding.service";
import { ApiResponse } from "../../utils/api-response";

export const onboardingController = {
  getFields: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fields = await onboardingService.getFields();
      res.json(ApiResponse.success(fields));
    } catch (error) {
      next(error);
    }
  },

  getTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { field } = req.params;
      const types = await onboardingService.getTypes(field);
      res.json(ApiResponse.success(types));
    } catch (error) {
      next(error);
    }
  },

  complete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const email = (req as any).userEmail;
      const { field, type, username, auth_provider, auth_provider_id } = req.body;

      const result = await onboardingService.complete(userId, email, {
        field,
        type,
        username,
        auth_provider,
        auth_provider_id,
      });

      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  checkStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const status = await onboardingService.checkStatus(userId);
      res.json(ApiResponse.success(status));
    } catch (error) {
      next(error);
    }
  },
};
