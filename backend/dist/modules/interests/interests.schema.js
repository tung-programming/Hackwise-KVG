"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInterestSchema = void 0;
// Zod schemas for interests
const zod_1 = require("zod");
exports.addInterestSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        category: zod_1.z.string().min(1).max(50),
    }),
});
//# sourceMappingURL=interests.schema.js.map