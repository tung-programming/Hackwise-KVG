// Courses controller
import { Request, Response, NextFunction } from "express";
import { coursesService } from "./courses.service";
import { ApiResponse } from "../../utils/api-response";

export const coursesController = {
  // Get all courses for an interest
  getCoursesByInterest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { interestId } = req.query;

      if (!interestId) {
        return res.status(400).json(ApiResponse.error("interestId query param required", 400));
      }

      const courses = await coursesService.getCoursesByInterest(userId, interestId as string);
      res.json(ApiResponse.success(courses));
    } catch (error) {
      next(error);
    }
  },

  // Get single course
  getCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const course = await coursesService.getCourse(userId, id);
      res.json(ApiResponse.success(course));
    } catch (error) {
      next(error);
    }
  },

  // Mark course as completed
  completeCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const result = await coursesService.completeCourse(userId, id);
      res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  },
};
