import { z } from "zod";
export declare const submitProjectSchema: z.ZodObject<{
    body: z.ZodObject<{
        submission_url: z.ZodString;
        submission_data: z.ZodOptional<z.ZodObject<{
            notes: z.ZodOptional<z.ZodString>;
            technologies_used: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            live_demo_url: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        }, {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        submission_url: string;
        submission_data?: {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        } | undefined;
    }, {
        submission_url: string;
        submission_data?: {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        submission_url: string;
        submission_data?: {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        submission_url: string;
        submission_data?: {
            notes?: string | undefined;
            technologies_used?: string[] | undefined;
            live_demo_url?: string | undefined;
        } | undefined;
    };
}>;
export type SubmitProjectInput = z.infer<typeof submitProjectSchema>["body"];
//# sourceMappingURL=projects.schema.d.ts.map