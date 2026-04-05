"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitProjectSchema = void 0;
// Zod schemas for projects
const zod_1 = require("zod");
exports.submitProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        submission_url: zod_1.z.string().url("Must be a valid URL"),
        submission_data: zod_1.z
            .object({
            notes: zod_1.z.string().max(2000).optional(),
            technologies_used: zod_1.z.array(zod_1.z.string()).optional(),
            live_demo_url: zod_1.z.string().url().optional(),
        })
            .optional(),
    }),
});
//# sourceMappingURL=projects.schema.js.map