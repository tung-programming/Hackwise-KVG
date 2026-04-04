// Gemini multi-key pool & rotation with exhaustion handling
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

interface KeyState {
  key: string;
  requestCount: number;
  lastUsed: Date | null;
  isExhausted: boolean;
  exhaustedAt: Date | null;
}

class GeminiKeyPool {
  private keys: KeyState[];
  private currentIndex: number = 0;
  private clients: Map<string, GoogleGenerativeAI> = new Map();
  private cooldownMs: number = 60 * 1000; // 60 seconds cooldown
  private totalRequests: number = 0;

  constructor() {
    const rawKeys = env.GEMINI_KEYS.split(",").map((key) => key.trim()).filter(k => k.length > 0);
    if (rawKeys.length === 0) {
      throw new Error("No Gemini API keys provided");
    }

    this.keys = rawKeys.map((key) => ({
      key,
      requestCount: 0,
      lastUsed: null,
      isExhausted: false,
      exhaustedAt: null,
    }));

    rawKeys.forEach((key) => {
      this.clients.set(key, new GoogleGenerativeAI(key));
    });

    console.log(`✅ Gemini key pool initialized with ${this.keys.length} keys`);
  }

  private getNextAvailableKey(): KeyState | null {
    const now = new Date();

    // First, try to recover exhausted keys
    this.keys.forEach((keyState) => {
      if (keyState.isExhausted && keyState.exhaustedAt) {
        const elapsed = now.getTime() - keyState.exhaustedAt.getTime();
        if (elapsed >= this.cooldownMs) {
          keyState.isExhausted = false;
          keyState.exhaustedAt = null;
          console.log(`🔄 Key recovered from exhaustion`);
        }
      }
    });

    // Round-robin through available keys
    const startIndex = this.currentIndex;
    do {
      const keyState = this.keys[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;

      if (!keyState.isExhausted) {
        return keyState;
      }
    } while (this.currentIndex !== startIndex);

    return null; // All keys exhausted
  }

  private markKeyExhausted(keyState: KeyState): void {
    keyState.isExhausted = true;
    keyState.exhaustedAt = new Date();
    console.warn(`⚠️ Key marked as exhausted, will recover in ${this.cooldownMs / 1000}s`);
  }

  getClient(): GoogleGenerativeAI {
    const keyState = this.getNextAvailableKey();
    if (!keyState) {
      throw new Error("All Gemini API keys are exhausted. Please try again later.");
    }

    keyState.requestCount++;
    keyState.lastUsed = new Date();
    this.totalRequests++;

    // Log stats every 100 requests
    if (this.totalRequests % 100 === 0) {
      this.logStats();
    }

    return this.clients.get(keyState.key)!;
  }

  async generateContent(
    prompt: string,
    model: string = "gemini-2.5-flash",
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error | null = null;
    let fullPoolRetries = 0;

    while (fullPoolRetries < maxRetries) {
      const keyState = this.getNextAvailableKey();

      if (!keyState) {
        // All keys exhausted, wait and retry
        fullPoolRetries++;
        if (fullPoolRetries < maxRetries) {
          console.log(`⏳ All keys exhausted, waiting 5s before retry ${fullPoolRetries}/${maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }
        throw new Error("All Gemini API keys are exhausted after multiple retries");
      }

      try {
        keyState.requestCount++;
        keyState.lastUsed = new Date();
        this.totalRequests++;

        const client = this.clients.get(keyState.key)!;
        const genModel = client.getGenerativeModel({ model });
        const result = await genModel.generateContent(prompt);
        return result.response.text();
      } catch (error: any) {
        lastError = error;

        if (error.status === 429) {
          // Rate limited - mark key as exhausted
          this.markKeyExhausted(keyState);
          continue;
        }

        if (error.status === 500 || error.status === 503) {
          // Transient error - retry with delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error("Failed to generate content");
  }

  // Generate with specific model type (flash or pro)
  async generateWithFlash(prompt: string): Promise<string> {
    return this.generateContent(prompt, "gemini-1.5-flash");
  }

  async generateWithPro(prompt: string): Promise<string> {
    return this.generateContent(prompt, "gemini-1.5-pro");
  }

  private logStats(): void {
    console.log("📊 Gemini Key Pool Stats:");
    console.log(`   Total requests: ${this.totalRequests}`);
    console.log(`   Keys: ${this.keys.length}`);
    const exhaustedCount = this.keys.filter((k) => k.isExhausted).length;
    console.log(`   Exhausted keys: ${exhaustedCount}`);
  }

  getStats() {
    return {
      totalKeys: this.keys.length,
      totalRequests: this.totalRequests,
      exhaustedKeys: this.keys.filter((k) => k.isExhausted).length,
      availableKeys: this.keys.filter((k) => !k.isExhausted).length,
    };
  }
}

export const geminiPool = new GeminiKeyPool();
export default geminiPool;
