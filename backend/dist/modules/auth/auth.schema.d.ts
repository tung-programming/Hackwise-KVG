import { z } from 'zod';
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
    }, {
        refreshToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken: string;
    };
}, {
    body: {
        refreshToken: string;
    };
}>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
//# sourceMappingURL=auth.schema.d.ts.map