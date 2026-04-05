import { z } from 'zod';
export declare const addInterestSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        category: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
    }, {
        name: string;
        category: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: string;
    };
}, {
    body: {
        name: string;
        category: string;
    };
}>;
export type AddInterestInput = z.infer<typeof addInterestSchema>['body'];
//# sourceMappingURL=interests.schema.d.ts.map