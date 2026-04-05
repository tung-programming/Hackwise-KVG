import { z } from "zod";
export declare const completeOnboardingSchema: z.ZodObject<{
    body: z.ZodObject<{
        field: z.ZodEnum<["engineering", "business", "law", "medical"]>;
        type: z.ZodString;
        username: z.ZodString;
        auth_provider: z.ZodEnum<["github", "google"]>;
        auth_provider_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        username: string;
        field: "engineering" | "business" | "law" | "medical";
        auth_provider: "google" | "github";
        auth_provider_id: string;
    }, {
        type: string;
        username: string;
        field: "engineering" | "business" | "law" | "medical";
        auth_provider: "google" | "github";
        auth_provider_id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: string;
        username: string;
        field: "engineering" | "business" | "law" | "medical";
        auth_provider: "google" | "github";
        auth_provider_id: string;
    };
}, {
    body: {
        type: string;
        username: string;
        field: "engineering" | "business" | "law" | "medical";
        auth_provider: "google" | "github";
        auth_provider_id: string;
    };
}>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>["body"];
//# sourceMappingURL=onboarding.schema.d.ts.map