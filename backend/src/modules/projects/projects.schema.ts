// Zod schemas for projects
import { z } from "zod";

export const submitProjectSchema = z.object({
  body: z.object({
    submission_url: z.string().url("Must be a valid URL"),
    submission_data: z
      .object({
        notes: z.string().max(2000).optional(),
        technologies_used: z.array(z.string()).optional(),
        live_demo_url: z.string().url().optional(),
      })
      .optional(),
  }),
});

export type SubmitProjectInput = z.infer<typeof submitProjectSchema>["body"];
