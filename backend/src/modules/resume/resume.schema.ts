// Zod schemas for resume
import { z } from "zod";

export const analyzeResumeSchema = z.object({
  body: z.object({
    job_description: z.string().min(1).max(10000).optional(),
  }),
});

export const atsScoreSchema = z.object({
  body: z.object({
    job_description: z.string().min(1, "Job description is required").max(10000),
  }),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>["body"];
export type ATSScoreInput = z.infer<typeof atsScoreSchema>["body"];
