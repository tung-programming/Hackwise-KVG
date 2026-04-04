// Gemini multi-key pool & rotation
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

class GeminiKeyPool {
  private keys: string[];
  private currentIndex: number = 0;
  private clients: Map<string, GoogleGenerativeAI> = new Map();

  constructor() {
    this.keys = env.GEMINI_API_KEYS.split(",").map((key) => key.trim());
    if (this.keys.length === 0) {
      throw new Error("No Gemini API keys provided");
    }
    this.keys.forEach((key) => {
      this.clients.set(key, new GoogleGenerativeAI(key));
    });
  }

  getClient(): GoogleGenerativeAI {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return this.clients.get(key)!;
  }

  async generateContent(prompt: string, model: string = "gemini-pro") {
    const client = this.getClient();
    const genModel = client.getGenerativeModel({ model });
    const result = await genModel.generateContent(prompt);
    return result.response.text();
  }
}

export const geminiPool = new GeminiKeyPool();
export default geminiPool;
