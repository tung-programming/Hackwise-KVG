// Users controller
import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { ApiResponse } from "../../utils/api-response";
import { supabase } from "../../config/database";

export const usersController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await usersService.getProfile(userId);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await usersService.updateProfile(userId, req.body);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const stats = await usersService.getStats(userId);
      res.json(ApiResponse.success(stats));
    } catch (error) {
      next(error);
    }
  },

  getPublicProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await usersService.getPublicProfile(id);
      res.json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  },

  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      await usersService.deleteAccount(userId);
      res.json(ApiResponse.success({ message: "Account deleted successfully" }));
    } catch (error) {
      next(error);
    }
  },

  completeTour: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const { error } = await supabase
        .from("users")
        .update({ has_seen_tour: true, updated_at: new Date().toISOString() })
        .eq("id", userId);
      
      if (error) throw error;
      return res.status(200).json(ApiResponse.success({ message: "Tour completed" }));
    } catch (error) {
      next(error);
    }
  },
};