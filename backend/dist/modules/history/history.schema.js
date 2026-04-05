"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistorySchema = void 0;
// Zod schemas for history
const zod_1 = require("zod");
exports.getHistorySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
//# sourceMappingURL=history.schema.js.map