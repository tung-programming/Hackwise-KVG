"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgressSchema = exports.generateRoadmapSchema = void 0;
// Zod schemas for courses
const zod_1 = require("zod");
exports.generateRoadmapSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(1).max(200),
        level: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    }),
});
exports.updateProgressSchema = zod_1.z.object({
    body: zod_1.z.object({
        moduleId: zod_1.z.string().uuid(),
        completed: zod_1.z.boolean(),
    }),
});
//# sourceMappingURL=courses.schema.js.map