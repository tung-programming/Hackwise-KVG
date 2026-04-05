import { Request, Response, NextFunction } from "express";
export declare const historyController: {
    uploadHistory: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=history.controller.d.ts.map