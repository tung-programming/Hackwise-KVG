"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOnboardingSchema = void 0;
// Zod schemas for onboarding
const zod_1 = require("zod");
exports.completeOnboardingSchema = zod_1.z.object({
    body: zod_1.z.object({
        field: zod_1.z.enum(["engineering", "business", "law", "medical"]),
        type: zod_1.z.string().min(1).max(100),
        username: zod_1.z.string().min(3).max(100),
        auth_provider: zod_1.z.enum(["github", "google"]),
        auth_provider_id: zod_1.z.string().min(1),
    }),
});
//# sourceMappingURL=onboarding.schema.js.map