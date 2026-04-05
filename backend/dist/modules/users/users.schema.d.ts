import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
    }, {
        name?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
    };
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
//# sourceMappingURL=users.schema.d.ts.map