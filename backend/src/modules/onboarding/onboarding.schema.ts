// Zod schemas for onboarding
import { z } from "zod";

export const completeOnboardingSchema = z.object({
  body: z.object({
    field: z.enum(["engineering", "business", "law", "medical"]),
    type: z.string().min(1).max(100),
    username: z.string().min(3).max(100),
    auth_provider: z.enum(["github", "google"]),
    auth_provider_id: z.string().min(1),
  }),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>["body"];
