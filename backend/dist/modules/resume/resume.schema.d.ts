import { z } from "zod";
export declare const analyzeResumeSchema: z.ZodObject<{
    body: z.ZodObject<{
        job_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        job_description?: string | undefined;
    }, {
        job_description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        job_description?: string | undefined;
    };
}, {
    body: {
        job_description?: string | undefined;
    };
}>;
export declare const atsScoreSchema: z.ZodObject<{
    body: z.ZodObject<{
        job_description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        job_description: string;
    }, {
        job_description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        job_description: string;
    };
}, {
    body: {
        job_description: string;
    };
}>;
export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>["body"];
export type ATSScoreInput = z.infer<typeof atsScoreSchema>["body"];
//# sourceMappingURL=resume.schema.d.ts.map