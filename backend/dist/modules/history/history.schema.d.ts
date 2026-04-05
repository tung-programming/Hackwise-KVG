import { z } from 'zod';
export declare const getHistorySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page?: string | undefined;
        limit?: string | undefined;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
    };
}>;
export type GetHistoryQuery = z.infer<typeof getHistorySchema>['query'];
//# sourceMappingURL=history.schema.d.ts.map