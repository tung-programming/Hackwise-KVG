// Gemini OCR extraction with fallback
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";

// Resume-analysis OCR must use only GEMINI_OCR_KEYS from env
const ocrKeys = (env.GEMINI_OCR_KEYS || "")
  .split(",")
  .map((k) => k.trim())
  .filter((k) => k.length > 0);
const ocrClients = ocrKeys.map((key) => new GoogleGenerativeAI(key));

console.log(
  `✅ Gemini OCR initialized with ${ocrClients.length} key(s) from GEMINI_OCR_KEYS`
);

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

const decodePdfLiteralString = (input: string): string => {
  let out = "";

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (ch !== "\\") {
      out += ch;
      continue;
    }

    const next = input[i + 1];
    if (!next) break;

    if (next === "n") {
      out += "\n";
      i++;
      continue;
    }
    if (next === "r") {
      out += "\r";
      i++;
      continue;
    }
    if (next === "t") {
      out += "\t";
      i++;
      continue;
    }
    if (next === "b") {
      out += "\b";
      i++;
      continue;
    }
    if (next === "f") {
      out += "\f";
      i++;
      continue;
    }
    if (next === "(" || next === ")" || next === "\\") {
      out += next;
      i++;
      continue;
    }

    if (/[0-7]/.test(next)) {
      const octal = input.slice(i + 1, i + 4).match(/^[0-7]{1,3}/)?.[0];
      if (octal) {
        out += String.fromCharCode(parseInt(octal, 8));
        i += octal.length;
        continue;
      }
    }

    out += next;
    i++;
  }

  return out;
};

const extractTextFromPdfBuffer = (fileBuffer: Buffer): string => {
  const raw = fileBuffer.toString("latin1");
  const chunks: string[] = [];

  // Capture simple PDF text operators: (...) Tj and [ ... ] TJ
  const tjRegex = /\((?:\\.|[^\\()])*\)\s*Tj/g;
  const tjArrayRegex = /\[(.*?)\]\s*TJ/gs;

  const tjMatches = raw.match(tjRegex) || [];
  for (const m of tjMatches) {
    const literal = m.replace(/\)\s*Tj$/, "").replace(/^\(/, "");
    chunks.push(decodePdfLiteralString(literal));
  }

  let arrayMatch: RegExpExecArray | null = null;
  while ((arrayMatch = tjArrayRegex.exec(raw)) !== null) {
    const block = arrayMatch[1];
    const stringParts = block.match(/\((?:\\.|[^\\()])*\)/g) || [];
    for (const part of stringParts) {
      chunks.push(decodePdfLiteralString(part.slice(1, -1)));
    }
  }

  return chunks.join(" ").replace(/\s+/g, " ").trim();
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

const extractTextWithTesseract = async (fileBuffer: Buffer): Promise<string> => {
  const tesseractModule = safeRequire("tesseract.js");
  if (!tesseractModule?.recognize) return "";

  try {
    const result = await tesseractModule.recognize(fileBuffer, "eng");
    return (result?.data?.text || "").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
};

/**
 * Extract text from PDF/image using Gemini Vision
 */
export const extractTextFromResume = async (
  fileBuffer: Buffer,
  mimeType: string
): Promise<OCRResult> => {
  // 1) Local PDF text extraction (no API)
  if (mimeType === "application/pdf") {
    const parsedPdfText = await extractTextWithPdfParse(fileBuffer);
    if (parsedPdfText.length > 80) {
      console.log("✅ PDF text extracted locally via pdf-parse");
      return { text: parsedPdfText, success: true };
    }

    const localPdfText = extractTextFromPdfBuffer(fileBuffer);
    if (localPdfText.length > 80) {
      console.log("✅ PDF text extracted locally without OCR API");
      return { text: localPdfText, success: true };
    }
  }

  // 2) Local image OCR with Tesseract (no API)
  if (mimeType.startsWith("image/")) {
    const imageText = await extractTextWithTesseract(fileBuffer);
    if (imageText.length > 80) {
      console.log("✅ Image text extracted locally via Tesseract");
      return { text: imageText, success: true };
    }
  }

  // 3) Gemini OCR path when local extraction fails
  if (ocrClients.length === 0) {
    return {
      text: "",
      success: false,
      error:
        mimeType === "application/pdf"
          ? "Local PDF extraction could not read this file and GEMINI_OCR_KEYS is missing."
          : "Local image OCR unavailable and GEMINI_OCR_KEYS is missing.",
    };
  }

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
      mimeType: mimeType,
    },
  };

  let sawRateLimit = false;
  let sawNetworkError = false;
  let lastError = "Unknown OCR error";

  // Try all OCR keys with rotation until one works
  for (let i = 0; i < ocrClients.length; i++) {
    const client = ocrClients[i];
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp"];
    
    for (const modelName of models) {
      try {
        console.log(`🔄 Trying OCR key ${i + 1}/${ocrClients.length} with model ${modelName}...`);
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();

        if (text && text.length > 50) {
          console.log(`✅ OCR extraction successful with key ${i + 1} and model ${modelName}`);
          return { text, success: true };
        } else {
          console.warn(`⚠️ Key ${i + 1} model ${modelName} returned empty/short response`);
        }
      } catch (error: any) {
        const errMsg = error?.message || String(error);
        lastError = errMsg.substring(0, 300);
        console.error(
          `❌ OCR key ${i + 1} model ${modelName} failed:`,
          errMsg.substring(0, 300)
        );

        if (error?.status === 403 || errMsg.includes("403")) {
          lastError = "OCR model access is blocked for this key.";
          break;
        }

        if (
          error?.status === 429 ||
          errMsg.includes("429") ||
          errMsg.toLowerCase().includes("quota") ||
          errMsg.toLowerCase().includes("rate")
        ) {
          sawRateLimit = true;
        }

        if (
          errMsg.includes("Error fetching from https://generativelanguage.googleapis.com") ||
          errMsg.toLowerCase().includes("fetch failed") ||
          errMsg.toLowerCase().includes("network")
        ) {
          sawNetworkError = true;
        }
        
        // If rate limited, wait briefly before trying next
        if (error?.status === 429 || errMsg.includes("429") || errMsg.includes("quota")) {
          console.log(`⏳ Rate limited, waiting 3s...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        continue;
      }
    }
  }

  return {
    text: "",
    success: false,
    error: sawNetworkError
      ? mimeType === "application/pdf"
        ? "PDF appears scanned/image-based and OCR API is unreachable. Please verify GEMINI_OCR_KEYS and internet access, then retry."
        : "Image OCR requires Gemini API connectivity. Please verify GEMINI_OCR_KEYS and internet access, then retry."
      : sawRateLimit
        ? "OCR rate limit reached for configured resume-analysis key(s). Please retry after a short wait."
        : `OCR failed: ${lastError}`,
  };
};

/**
 * Check if file type is supported for OCR
 */
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

/**
 * Get appropriate mime type for Gemini
 */
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
