"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
// Zod schemas for users
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        avatar: zod_1.z.string().url().optional(),
        bio: zod_1.z.string().max(500).optional(),
    }),
});
//# sourceMappingURL=users.schema.js.map