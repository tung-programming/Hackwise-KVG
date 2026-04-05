"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// Environment variable validation (Zod)
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
// Load .env file
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().default("4000"),
    // Supabase
    SUPABASE_URL: zod_1.z.string(),
    SUPABASE_SERVICE_KEY: zod_1.z.string(),
    SUPABASE_ANON_KEY: zod_1.z.string(),
    STORAGE_BUCKET: zod_1.z.string().default("coursehive-uploads"),
    // JWT
    JWT_SECRET: zod_1.z.string(),
    JWT_ACCESS_EXPIRY: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRY: zod_1.z.string().default("7d"),
    // Gemini Key Pool (comma-separated, 20-30 keys)
    GEMINI_KEYS: zod_1.z.string(),
    // App
    FRONTEND_URL: zod_1.z.string().default("http://localhost:3000"),
    BACKEND_URL: zod_1.z.string().default("http://localhost:4000"),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map