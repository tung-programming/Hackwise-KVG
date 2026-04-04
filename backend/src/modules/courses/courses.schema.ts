// Zod schemas for courses
import { z } from 'zod';

export const generateRoadmapSchema = z.object({
  body: z.object({
    topic: z.string().min(1).max(200),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
});

export const updateProgressSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid(),
    completed: z.boolean(),
  }),
});

export type GenerateRoadmapInput = z.infer<typeof generateRoadmapSchema>['body'];
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>['body'];
