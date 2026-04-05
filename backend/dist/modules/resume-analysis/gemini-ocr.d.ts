interface OCRResult {
    text: string;
    success: boolean;
    error?: string;
}
export declare const extractTextFromResume: (fileBuffer: Buffer, mimeType: string) => Promise<OCRResult>;
export declare const isSupportedForOCR: (mimeType: string) => boolean;
export declare const getGeminiMimeType: (originalMime: string) => string;
export {};
//# sourceMappingURL=gemini-ocr.d.ts.map