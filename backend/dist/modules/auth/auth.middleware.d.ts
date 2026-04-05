import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRequest: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map