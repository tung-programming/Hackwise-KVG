import { Request, Response, NextFunction } from "express";
export declare const onboardingController: {
    getFields: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTypes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    complete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    checkStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=onboarding.controller.d.ts.map