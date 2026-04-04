// Zod schemas for interests
import { z } from 'zod';

export const addInterestSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    category: z.string().min(1).max(50),
  }),
});

export type AddInterestInput = z.infer<typeof addInterestSchema>['body'];
