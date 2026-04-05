"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = void 0;
// Zod schemas for auth
const zod_1 = require("zod");
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
//# sourceMappingURL=auth.schema.js.map