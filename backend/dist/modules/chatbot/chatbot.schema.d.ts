import { z } from "zod";
export declare const chatbotQuerySchema: z.ZodObject<{
    body: z.ZodObject<{
        message: z.ZodString;
        maxResults: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        maxResults?: number | undefined;
    }, {
        message: string;
        maxResults?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        maxResults?: number | undefined;
    };
}, {
    body: {
        message: string;
        maxResults?: number | undefined;
    };
}>;
export type ChatbotQueryInput = z.infer<typeof chatbotQuerySchema>["body"];
//# sourceMappingURL=chatbot.schema.d.ts.map