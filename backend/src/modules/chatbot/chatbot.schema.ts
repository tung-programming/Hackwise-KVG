import { z } from "zod";

export const chatbotQuerySchema = z.object({
  body: z.object({
    message: z.string().min(2).max(1000),
    maxResults: z.number().int().min(1).max(8).optional(),
  }),
});

export type ChatbotQueryInput = z.infer<typeof chatbotQuerySchema>["body"];

