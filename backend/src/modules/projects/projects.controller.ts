// Projects controller
import { Request, Response, NextFunction } from 'express';
import { projectsService } from './projects.service';
import { ApiResponse } from '../../utils/api-response';

export const projectsController = {
  getProjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const projects = await projectsService.getUserProjects(userId);
      res.json(ApiResponse.success(projects));
    } catch (error) {
      next(error);
    }
  },

  getProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { projectId } = req.params;
      const project = await projectsService.getProject(userId, projectId);
      res.json(ApiResponse.success(project));
    } catch (error) {
      next(error);
    }
  },

  createProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const project = await projectsService.createProject(userId, req.body);
      res.json(ApiResponse.success(project));
    } catch (error) {
      next(error);
    }
  },

  updateProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { projectId } = req.params;
      const project = await projectsService.updateProject(userId, projectId, req.body);
      res.json(ApiResponse.success(project));
    } catch (error) {
      next(error);
    }
  },

  validateProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { projectId } = req.params;
      const validation = await projectsService.validateProject(userId, projectId);
      res.json(ApiResponse.success(validation));
    } catch (error) {
      next(error);
    }
  },

  deleteProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { projectId } = req.params;
      await projectsService.deleteProject(userId, projectId);
      res.json(ApiResponse.success({ message: 'Project deleted' }));
    } catch (error) {
      next(error);
    }
  },
};
