// Zod schemas for resume
import { z } from 'zod';

export const analyzeResumeSchema = z.object({
  body: z.object({
    jobDescription: z.string().min(1).max(5000).optional(),
  }),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>['body'];
