// Zod schemas for history
import { z } from 'zod';

export const getHistorySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export type GetHistoryQuery = z.infer<typeof getHistorySchema>['query'];
