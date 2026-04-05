interface ATSAnalysis {
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
export declare const analyzeResumeATS: (resumeContent: string, jobDescription?: string) => Promise<ATSAnalysis>;
export {};
//# sourceMappingURL=ats.analyzer.d.ts.map