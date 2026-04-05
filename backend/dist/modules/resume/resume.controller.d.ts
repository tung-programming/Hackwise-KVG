import { Request, Response, NextFunction } from "express";
export declare const resumeController: {
    uploadResume: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getResume: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    analyzeResume: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getATSScore: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteResume: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=resume.controller.d.ts.map