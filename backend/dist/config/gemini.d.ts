import { GoogleGenAI } from "@google/genai";
declare class GeminiKeyPool {
    private keys;
    private currentIndex;
    private clients;
    private totalRequests;
    constructor();
    private cleanOldRequests;
    private isKeyWithinLimits;
    private recordRequest;
    private getNextAvailableKey;
    private markKeyExhausted;
    getClient(): GoogleGenAI;
    private estimateTokens;
    generateContent(prompt: string, model?: string, options?: {
        maxRetries?: number;
        maxOutputTokens?: number;
        temperature?: number;
        responseMimeType?: string;
    }): Promise<string>;
    generateWithFlash(prompt: string, maxOutputTokens?: number): Promise<string>;
    generateWithPro(prompt: string, maxOutputTokens?: number): Promise<string>;
    generateJSON<T>(prompt: string, maxOutputTokens?: number): Promise<T>;
    private logStats;
    getStats(): {
        totalKeys: number;
        totalRequests: number;
        exhaustedKeys: number;
        availableKeys: number;
        rateLimitedKeys: number;
    };
}
export declare const geminiPool: GeminiKeyPool;
export declare const GEMINI_MODELS: {
    readonly FLASH: "gemini-2.5-flash";
    readonly PRO: "gemini-2.5-pro";
    readonly FLASH_FALLBACK: "gemini-2.0-flash";
};
export default geminiPool;
//# sourceMappingURL=gemini.d.ts.map