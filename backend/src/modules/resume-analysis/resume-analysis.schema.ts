// Resume Analysis Validation Schemas
import { z } from "zod";

export const reAnalyzeSchema = z.object({
  body: z.object({
    job_description: z.string().optional(),
  }),
});

export const suggestionsSchema = z.object({
  body: z.object({
    job_description: z.string().min(10, "Job description must be at least 10 characters"),
  }),
});

export type ReAnalyzeInput = z.infer<typeof reAnalyzeSchema>["body"];
export type SuggestionsInput = z.infer<typeof suggestionsSchema>["body"];
