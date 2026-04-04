// Projects controller
import { Request, Response, NextFunction } from "express";
import { projectsService } from "./projects.service";
import { ApiResponse } from "../../utils/api-response";

export const projectsController = {
  // Get all projects for user
  getProjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const projects = await projectsService.getUserProjects(userId);
      res.json(ApiResponse.success(projects));
    } catch (error) {
      next(error);
    }
  },

  // Get single project
  getProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const project = await projectsService.getProject(userId, id);
      res.json(ApiResponse.success(project));
    } catch (error) {
      next(error);
    }
  },

  // Submit project
  submitProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { submission_url, submission_data } = req.body;

      if (!submission_url) {
        return res.status(400).json(ApiResponse.error("submission_url is required", 400));
      }

      const result = await projectsService.submitProject(userId, id, submission_url, submission_data);
      // Return 202 for async validation
      res.status(202).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  // Get validation result
  getValidation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const validation = await projectsService.getValidation(userId, id);
      res.json(ApiResponse.success(validation));
    } catch (error) {
      next(error);
    }
  },
};
