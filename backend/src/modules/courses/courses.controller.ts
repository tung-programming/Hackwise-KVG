// Courses controller
import { Request, Response, NextFunction } from 'express';
import { coursesService } from './courses.service';
import { ApiResponse } from '../../utils/api-response';

export const coursesController = {
  getCourses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const courses = await coursesService.getUserCourses(userId);
      res.json(ApiResponse.success(courses));
    } catch (error) {
      next(error);
    }
  },

  getCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { courseId } = req.params;
      const course = await coursesService.getCourse(userId, courseId);
      res.json(ApiResponse.success(course));
    } catch (error) {
      next(error);
    }
  },

  generateRoadmap: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { topic, level } = req.body;
      const roadmap = await coursesService.generateRoadmap(userId, topic, level);
      res.json(ApiResponse.success(roadmap));
    } catch (error) {
      next(error);
    }
  },

  updateProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { courseId } = req.params;
      const { moduleId, completed } = req.body;
      const result = await coursesService.updateProgress(userId, courseId, moduleId, completed);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  deleteCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { courseId } = req.params;
      await coursesService.deleteCourse(userId, courseId);
      res.json(ApiResponse.success({ message: 'Course deleted' }));
    } catch (error) {
      next(error);
    }
  },
};
