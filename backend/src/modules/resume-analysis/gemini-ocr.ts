import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";

const ocrKeys = (env.GEMINI_OCR_KEYS || "")
  .split(",")
  .map((k) => k.trim())
  .filter((k) => k.length > 0);
const ocrClients = ocrKeys.map((key) => new GoogleGenerativeAI(key));

console.log(`✅ Gemini OCR initialized with ${ocrClients.length} key(s) from GEMINI_OCR_KEYS`);
if (ocrClients.length === 0) {
  console.error("⚠️ WARNING: No GEMINI_OCR_KEYS configured - OCR will fail!");
}

interface OCRResult {
  text: string;
  success: boolean;
  error?: string;
}

const safeRequire = (moduleName: string): any | null => {
  try {
    // eslint-disable-next-line no-eval
    const req = eval("require");
    return req(moduleName);
  } catch {
    return null;
  }
};

const extractTextWithPdfParse = async (fileBuffer: Buffer): Promise<string> => {
  const pdfParseModule = safeRequire("pdf-parse");
  if (!pdfParseModule) return "";

  try {
    const parser = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default;
    const result = await parser(fileBuffer);
    return (result?.text || "").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
};

export const extractTextFromResume = async (
  fileBuffer: Buffer,
  mimeType: string
): Promise<OCRResult> => {
  // 1) For PDFs: Try local text extraction first (no API needed)
  if (mimeType === "application/pdf") {
    const parsedPdfText = await extractTextWithPdfParse(fileBuffer);
    if (parsedPdfText.length > 80) {
      console.log("✅ PDF text extracted locally via pdf-parse");
      return { text: parsedPdfText, success: true };
    }
  }

  // 2) Gemini OCR ONLY - for images and scanned PDFs
  if (ocrClients.length === 0) {
    console.error("❌ GEMINI_OCR_KEYS not configured!");
    return {
      text: "",
      success: false,
      error: "GEMINI_OCR_KEYS is missing. Add your Gemini API keys to backend .env file.",
    };
  }

  console.log(`🔍 Starting Gemini OCR with ${ocrClients.length} key(s)...`);

  const base64Data = fileBuffer.toString("base64");
  const prompt = `Extract ALL text content from this resume document.
Return the complete text exactly as it appears, preserving:
- All sections (Contact, Experience, Education, Skills, etc.)
- All dates, titles, company names
- All bullet points and descriptions
- Certifications, awards, languages

If this is a PDF or image of a resume, extract every piece of text visible.
Return ONLY the extracted text content, no additional commentary.`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };

  let sawRateLimit = false;
  let sawNetworkError = false;
  let saw403 = false;
  let lastError = "Unknown OCR error";
  const errorDetails: string[] = [];

  for (let i = 0; i < ocrClients.length; i++) {
    const client = ocrClients[i];
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-001"];

    for (const modelName of models) {
      try {
        console.log(`🔄 Trying OCR key ${i + 1}/${ocrClients.length} with model ${modelName}...`);
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        if (text && text.length > 50) {
          console.log(`✅ OCR SUCCESS with key ${i + 1} and model ${modelName}`);
          return { text, success: true };
        }
      } catch (error: any) {
        const errMsg = error?.message || String(error);
        lastError = errMsg;
        const shortErr = errMsg.substring(0, 200);
        errorDetails.push(`Key ${i + 1}/${modelName}: ${shortErr}`);
        
        console.error(`❌ Key ${i + 1} model ${modelName} failed:`, shortErr);

        // Detect error types
        if (error?.status === 403 || errMsg.includes("403") || errMsg.includes("Forbidden")) {
          saw403 = true;
          console.error(`   ⚠️ 403 Forbidden - API may be blocked or key lacks permissions`);
        }

        if (
          error?.status === 429 ||
          errMsg.includes("429") ||
          errMsg.toLowerCase().includes("quota") ||
          errMsg.toLowerCase().includes("rate")
        ) {
          sawRateLimit = true;
          console.error(`   ⚠️ Rate limit hit - waiting 3 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        if (
          errMsg.includes("Error fetching from https://generativelanguage.googleapis.com") ||
          errMsg.toLowerCase().includes("fetch failed") ||
          errMsg.toLowerCase().includes("network") ||
          errMsg.includes("ENOTFOUND") ||
          errMsg.includes("ECONNREFUSED")
        ) {
          sawNetworkError = true;
          console.error(`   ⚠️ Network connectivity issue detected`);
        }
      }
    }
  }

  // All Gemini attempts failed
  console.error("❌ ALL GEMINI OCR ATTEMPTS FAILED");
  console.error("Error summary:", errorDetails.join(" | "));

  let finalError = "";
  if (saw403) {
    finalError = "Gemini API returned 403 Forbidden. Your API key(s) may lack permissions or the Generative Language API is not enabled. Visit https://aistudio.google.com/app/apikey to verify.";
  } else if (sawNetworkError) {
    finalError = "Cannot reach Gemini API (generativelanguage.googleapis.com). Check your internet connection, firewall, or proxy settings.";
  } else if (sawRateLimit) {
    finalError = "Gemini API rate limit exceeded. Wait a few minutes and try again, or add more API keys to GEMINI_OCR_KEYS.";
  } else {
    finalError = `Gemini OCR failed: ${lastError.substring(0, 200)}`;
  }

  return {
    text: "",
    success: false,
    error: finalError,
  };
};

export const isSupportedForOCR = (mimeType: string): boolean => {
  const supportedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  return supportedTypes.includes(mimeType);
};

export const getGeminiMimeType = (originalMime: string): string => {
  const mimeMap: Record<string, string> = {
    "application/pdf": "application/pdf",
    "image/png": "image/png",
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/webp": "image/webp",
    "image/heic": "image/heic",
    "image/heif": "image/heif",
  };
  return mimeMap[originalMime] || originalMime;
};