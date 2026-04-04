// Environment variable validation (Zod)
import { config } from "dotenv";
import { z } from "zod";

// Load .env file
config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3001"),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_KEY: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  STORAGE_BUCKET: z.string().default("coursehive-uploads"),

  // JWT (Supabase JWT secret for token verification)
  JWT_SECRET: z.string(),

  // Gemini Key Pool (comma-separated, 20-30 keys)
  GEMINI_KEYS: z.string(),

  // App
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
