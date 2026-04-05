import { z } from "zod";
export declare const reAnalyzeSchema: z.ZodObject<{
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
export declare const suggestionsSchema: z.ZodObject<{
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
export type ReAnalyzeInput = z.infer<typeof reAnalyzeSchema>["body"];
export type SuggestionsInput = z.infer<typeof suggestionsSchema>["body"];
//# sourceMappingURL=resume-analysis.schema.d.ts.map