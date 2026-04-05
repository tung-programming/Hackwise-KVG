export interface ResumeAnalysisResult {
    id: string;
    user_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    ats_score: number;
    feedback: object;
    suggestions: string[];
    status: string;
    analyzed_at: string;
    created_at: string;
}
export declare const resumeAnalysisService: {
    /**
     * Upload resume, extract text via OCR, analyze, and store results
     */
    uploadAndAnalyze: (userId: string, file: Express.Multer.File, jobDescription?: string) => Promise<ResumeAnalysisResult>;
    /**
     * Get user's resume analysis
     */
    getAnalysis: (userId: string) => Promise<ResumeAnalysisResult>;
    /**
     * Re-analyze existing resume with optional job description
     */
    reAnalyze: (userId: string, jobDescription?: string) => Promise<ResumeAnalysisResult>;
    /**
     * Get suggestions for a specific job description
     */
    getSuggestions: (userId: string, jobDescription: string) => Promise<{
        ats_score: number;
        suggestions: string[];
        missingKeywords: string[];
    }>;
    /**
     * Delete resume analysis
     */
    deleteAnalysis: (userId: string) => Promise<void>;
};
//# sourceMappingURL=resume-analysis.service.d.ts.map