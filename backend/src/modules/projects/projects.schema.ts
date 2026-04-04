// Zod schemas for projects
import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    technologies: z.array(z.string()).min(1),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(2000).optional(),
    repoUrl: z.string().url().optional().nullable(),
    liveUrl: z.string().url().optional().nullable(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['in_progress', 'completed', 'archived']).optional(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
