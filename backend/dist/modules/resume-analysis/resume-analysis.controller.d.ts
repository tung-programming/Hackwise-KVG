import { Request, Response, NextFunction } from "express";
export declare const resumeAnalysisController: {
    /**
     * POST /resume-analysis/upload - Upload and analyze resume
     */
    uploadAndAnalyze: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /resume-analysis - Get user's resume analysis
     */
    getAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /resume-analysis/re-analyze - Re-analyze existing resume
     */
    reAnalyze: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * POST /resume-analysis/suggestions - Get suggestions for job description
     */
    getSuggestions: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /resume-analysis - Delete resume analysis
     */
    deleteAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=resume-analysis.controller.d.ts.map