import { Request, Response, NextFunction } from "express";
export declare const interestsController: {
    getInterests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getInterest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    acceptInterest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectInterest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProgress: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=interests.controller.d.ts.map