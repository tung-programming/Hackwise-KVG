export interface ATSAnalysis {
    atsScore: number;
    keywordMatch: number;
    sections: {
        name: string;
        score: number;
        feedback: string;
    }[];
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    missingKeywords: string[];
}
export interface ATSFeedback {
    overall: string;
    sections: ATSAnalysis["sections"];
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
}
/**
 * Analyze resume for ATS compatibility using Groq
 */
export declare const analyzeResumeATS: (resumeContent: string, jobDescription?: string) => Promise<ATSAnalysis>;
/**
 * Convert ATSAnalysis to database-friendly feedback format
 */
export declare const formatFeedback: (analysis: ATSAnalysis) => ATSFeedback;
//# sourceMappingURL=ats-analyzer.d.ts.map