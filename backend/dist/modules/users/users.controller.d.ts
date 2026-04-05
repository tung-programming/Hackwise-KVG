import { Request, Response, NextFunction } from "express";
export declare const usersController: {
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPublicProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteAccount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=users.controller.d.ts.map