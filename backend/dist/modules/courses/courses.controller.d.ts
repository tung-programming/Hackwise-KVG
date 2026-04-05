import { Request, Response, NextFunction } from "express";
export declare const coursesController: {
    getCoursesByInterest: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    completeCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=courses.controller.d.ts.map