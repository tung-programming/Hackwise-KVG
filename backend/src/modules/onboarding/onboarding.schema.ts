// Zod schemas for onboarding
import { z } from 'zod';

export const submitStepSchema = z.object({
  body: z.object({
    step: z.number().int().min(0),
    data: z.record(z.any()),
  }),
});

export type SubmitStepInput = z.infer<typeof submitStepSchema>['body'];
