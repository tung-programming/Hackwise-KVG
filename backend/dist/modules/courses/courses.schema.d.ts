import { z } from 'zod';
export declare const generateRoadmapSchema: z.ZodObject<{
    body: z.ZodObject<{
        topic: z.ZodString;
        level: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    }, "strip", z.ZodTypeAny, {
        topic: string;
        level: "beginner" | "intermediate" | "advanced";
    }, {
        topic: string;
        level: "beginner" | "intermediate" | "advanced";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        topic: string;
        level: "beginner" | "intermediate" | "advanced";
    };
}, {
    body: {
        topic: string;
        level: "beginner" | "intermediate" | "advanced";
    };
}>;
export declare const updateProgressSchema: z.ZodObject<{
    body: z.ZodObject<{
        moduleId: z.ZodString;
        completed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        completed: boolean;
        moduleId: string;
    }, {
        completed: boolean;
        moduleId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        completed: boolean;
        moduleId: string;
    };
}, {
    body: {
        completed: boolean;
        moduleId: string;
    };
}>;
export type GenerateRoadmapInput = z.infer<typeof generateRoadmapSchema>['body'];
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>['body'];
//# sourceMappingURL=courses.schema.d.ts.map