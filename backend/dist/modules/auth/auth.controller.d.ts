import { Request, Response, NextFunction } from "express";
export declare const authController: {
    googleAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    googleCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    githubAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    githubCallback: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    me: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    refresh: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map