"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODELS = exports.geminiPool = void 0;
const genai_1 = require("@google/genai");
const env_1 = require("./env");
const MODELS = {
    FLASH: "gemini-2.5-flash",
    PRO: "gemini-2.5-pro",
    FLASH_FALLBACK: "gemini-2.0-flash",
};
const RATE_LIMIT = {
    requestsPerMinute: 15,
    tokensPerMinute: 32000,
    windowMs: 60 * 1000,
    cooldownMs: 60 * 1000,
};
class GeminiKeyPool {
    constructor() {
        this.currentIndex = 0;
        this.clients = new Map();
        this.totalRequests = 0;
        const rawKeys = env_1.env.GEMINI_KEYS.split(",").map((key) => key.trim()).filter(k => k.length > 0);
        if (rawKeys.length === 0) {
            throw new Error("No Gemini API keys provided");
        }
        this.keys = rawKeys.map((key) => ({
            key,
            requestCount: 0,
            lastUsed: null,
            isExhausted: false,
            exhaustedAt: null,
            requests: [],
            tokensUsed: 0,
        }));
        rawKeys.forEach((key) => {
            this.clients.set(key, new genai_1.GoogleGenAI({ apiKey: key }));
        });
        console.log(`Gemini key pool initialized with ${this.keys.length} keys`);
    }
    cleanOldRequests(keyState) {
        const now = Date.now();
        const cutoff = now - RATE_LIMIT.windowMs;
        const validRequests = keyState.requests.filter(r => r.timestamp > cutoff);
        keyState.requests = validRequests;
        keyState.tokensUsed = validRequests.reduce((sum, r) => sum + r.tokens, 0);
    }
    isKeyWithinLimits(keyState) {
        this.cleanOldRequests(keyState);
        if (keyState.requests.length >= RATE_LIMIT.requestsPerMinute)
            return false;
        if (keyState.tokensUsed >= RATE_LIMIT.tokensPerMinute * 0.9)
            return false;
        return true;
    }
    recordRequest(keyState, estimatedTokens) {
        keyState.requests.push({ timestamp: Date.now(), tokens: estimatedTokens });
        keyState.tokensUsed += estimatedTokens;
        keyState.requestCount++;
        keyState.lastUsed = new Date();
        this.totalRequests++;
    }
    getNextAvailableKey() {
        const now = Date.now();
        this.keys.forEach((keyState) => {
            if (keyState.isExhausted && keyState.exhaustedAt) {
                const elapsed = now - keyState.exhaustedAt.getTime();
                if (elapsed >= RATE_LIMIT.cooldownMs) {
                    keyState.isExhausted = false;
                    keyState.exhaustedAt = null;
                    keyState.requests = [];
                    keyState.tokensUsed = 0;
                    console.log(`🔄 Key recovered from exhaustion`);
                }
            }
        });
        const startIndex = this.currentIndex;
        do {
            const keyState = this.keys[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.keys.length;
            if (!keyState.isExhausted && this.isKeyWithinLimits(keyState)) {
                return keyState;
            }
        } while (this.currentIndex !== startIndex);
        const availableKeys = this.keys.filter(k => !k.isExhausted);
        if (availableKeys.length > 0) {
            return availableKeys.reduce((a, b) => a.requests.length < b.requests.length ? a : b);
        }
        return null;
    }
    markKeyExhausted(keyState) {
        keyState.isExhausted = true;
        keyState.exhaustedAt = new Date();
        console.warn(`⚠️ Key exhausted (429), cooldown ${RATE_LIMIT.cooldownMs / 1000}s`);
    }
    getClient() {
        const keyState = this.getNextAvailableKey();
        if (!keyState) {
            throw new Error("All Gemini API keys are exhausted. Please try again later.");
        }
        return this.clients.get(keyState.key);
    }
    estimateTokens(prompt) {
        return Math.ceil(prompt.length / 4) + 100;
    }
    async generateContent(prompt, model = MODELS.FLASH, options = {}) {
        const { maxRetries = 3, maxOutputTokens = 1024, temperature = 0.7, responseMimeType, } = options;
        const estimatedTokens = this.estimateTokens(prompt) + maxOutputTokens;
        let lastError = null;
        let fullPoolRetries = 0;
        let currentModel = model;
        while (fullPoolRetries < maxRetries) {
            const keyState = this.getNextAvailableKey();
            if (!keyState) {
                fullPoolRetries++;
                if (fullPoolRetries < maxRetries) {
                    const waitTime = Math.min(5000 * fullPoolRetries, 15000);
                    console.log(`⏳ All keys busy, waiting ${waitTime / 1000}s (retry ${fullPoolRetries}/${maxRetries})`);
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    continue;
                }
                throw new Error("All Gemini API keys are exhausted after multiple retries");
            }
            try {
                this.recordRequest(keyState, estimatedTokens);
                const client = this.clients.get(keyState.key);
                const result = await client.models.generateContent({
                    model: currentModel,
                    contents: prompt,
                    config: {
                        maxOutputTokens,
                        temperature,
                        ...(responseMimeType ? { responseMimeType } : {}),
                    },
                });
                const text = result.text ?? "";
                if (this.totalRequests % 50 === 0) {
                    this.logStats();
                }
                return text;
            }
            catch (error) {
                lastError = error;
                const status = error.status || error.code;
                if (status === 429) {
                    this.markKeyExhausted(keyState);
                    continue;
                }
                if (status === 404 || error.message?.includes("not found")) {
                    if (currentModel === MODELS.FLASH) {
                        console.log(`⚠️ ${currentModel} unavailable, trying fallback`);
                        currentModel = MODELS.FLASH_FALLBACK;
                        continue;
                    }
                    else if (currentModel === MODELS.PRO) {
                        console.log(`⚠️ ${currentModel} unavailable, trying flash`);
                        currentModel = MODELS.FLASH;
                        continue;
                    }
                }
                if (status === 500 || status === 503) {
                    const delay = 1000 * (fullPoolRetries + 1);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    fullPoolRetries++;
                    continue;
                }
                throw error;
            }
        }
        throw lastError || new Error("Failed to generate content");
    }
    async generateWithFlash(prompt, maxOutputTokens = 1024) {
        return this.generateContent(prompt, MODELS.FLASH, { maxOutputTokens, temperature: 0.7 });
    }
    async generateWithPro(prompt, maxOutputTokens = 2048) {
        return this.generateContent(prompt, MODELS.PRO, { maxOutputTokens, temperature: 0.5 });
    }
    async generateJSON(prompt, maxOutputTokens = 512) {
        const sanitize = (raw) => {
            let cleaned = raw.trim();
            if (cleaned.startsWith("```json"))
                cleaned = cleaned.slice(7);
            if (cleaned.startsWith("```"))
                cleaned = cleaned.slice(3);
            if (cleaned.endsWith("```"))
                cleaned = cleaned.slice(0, -3);
            return cleaned.trim();
        };
        const tryParseLenient = (raw) => {
            const cleaned = sanitize(raw);
            // 1) Direct parse
            try {
                return JSON.parse(cleaned);
            }
            catch { }
            // 2) Extract first full array/object block
            const firstArray = cleaned.indexOf("[");
            const lastArray = cleaned.lastIndexOf("]");
            if (firstArray !== -1 && lastArray > firstArray) {
                const arrSlice = cleaned.slice(firstArray, lastArray + 1);
                try {
                    return JSON.parse(arrSlice);
                }
                catch { }
            }
            const firstObj = cleaned.indexOf("{");
            const lastObj = cleaned.lastIndexOf("}");
            if (firstObj !== -1 && lastObj > firstObj) {
                const objSlice = cleaned.slice(firstObj, lastObj + 1);
                try {
                    return JSON.parse(objSlice);
                }
                catch { }
            }
            // 3) Truncation repair for arrays: keep up to last complete object and close bracket
            if (cleaned.startsWith("[") && !cleaned.endsWith("]")) {
                const lastBrace = cleaned.lastIndexOf("}");
                if (lastBrace !== -1) {
                    const repaired = `${cleaned.slice(0, lastBrace + 1)}]`;
                    try {
                        return JSON.parse(repaired);
                    }
                    catch { }
                }
            }
            // 4) Extract complete object chunks (helps when only tail is truncated)
            if (cleaned.startsWith("[")) {
                const chunks = cleaned.match(/\{[^{}]*\}/g);
                if (chunks && chunks.length > 0) {
                    const parsed = [];
                    for (const chunk of chunks) {
                        try {
                            parsed.push(JSON.parse(chunk));
                        }
                        catch { }
                    }
                    if (parsed.length > 0) {
                        return parsed;
                    }
                }
            }
            throw new Error(`Failed to parse JSON response: ${cleaned.substring(0, 240)}`);
        };
        const jsonPrompt = `${prompt}\n\nRespond with valid JSON only. No markdown, no code blocks, no explanation.`;
        const response = await this.generateContent(jsonPrompt, MODELS.FLASH, {
            maxOutputTokens,
            temperature: 0.2,
            responseMimeType: "application/json",
        });
        try {
            return tryParseLenient(response);
        }
        catch (firstError) {
            // One strict retry to recover from truncated/non-JSON output.
            const retryPrompt = `${prompt}\n\nCRITICAL OUTPUT RULES:\n- Return ONLY minified JSON.\n- Keep strings concise.\n- No commentary.\n- Ensure JSON closes fully.`;
            const retry = await this.generateContent(retryPrompt, MODELS.FLASH, {
                maxOutputTokens: Math.max(maxOutputTokens, 1200),
                temperature: 0.1,
                responseMimeType: "application/json",
            });
            try {
                return tryParseLenient(retry);
            }
            catch {
                throw firstError;
            }
        }
    }
    logStats() {
        const exhaustedCount = this.keys.filter((k) => k.isExhausted).length;
        const rateLimitedCount = this.keys.filter((k) => !k.isExhausted && !this.isKeyWithinLimits(k)).length;
        console.log(`📊 Gemini: ${this.totalRequests} reqs | ${this.keys.length - exhaustedCount - rateLimitedCount}/${this.keys.length} keys available`);
    }
    getStats() {
        return {
            totalKeys: this.keys.length,
            totalRequests: this.totalRequests,
            exhaustedKeys: this.keys.filter((k) => k.isExhausted).length,
            availableKeys: this.keys.filter((k) => !k.isExhausted && this.isKeyWithinLimits(k)).length,
            rateLimitedKeys: this.keys.filter((k) => !k.isExhausted && !this.isKeyWithinLimits(k)).length,
        };
    }
}
exports.geminiPool = new GeminiKeyPool();
exports.GEMINI_MODELS = MODELS;
exports.default = exports.geminiPool;
//# sourceMappingURL=gemini.js.map