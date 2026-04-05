import { Request, Response, NextFunction } from "express";
export declare const projectsController: {
    getProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    submitProject: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getValidation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=projects.controller.d.ts.map