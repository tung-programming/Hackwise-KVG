// Resume Analysis Service
import { supabase } from "../../config/database";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { extractTextFromResume, isSupportedForOCR, getGeminiMimeType } from "./gemini-ocr";
import { analyzeResumeATS, formatFeedback, ATSAnalysis } from "./ats-analyzer";

const RESUME_BUCKET = "resumes";

export interface ResumeAnalysisResult {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  ats_score: number;
  feedback: object;
  suggestions: string[];
  status: string;
  analyzed_at: string;
  created_at: string;
}

export const resumeAnalysisService = {
  /**
   * Upload resume, extract text via OCR, analyze, and store results
   */
  uploadAndAnalyze: async (
    userId: string,
    file: Express.Multer.File,
    jobDescription?: string
  ): Promise<ResumeAnalysisResult> => {
    // Validate file type for OCR
    if (!isSupportedForOCR(file.mimetype)) {
      throw new BadRequestError(
        "Unsupported file type. Please upload PDF or image (PNG, JPEG, WebP)"
      );
    }

    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop() || "pdf";
    const filePath = `${userId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage (resumes bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(RESUME_BUCKET)
      .getPublicUrl(uploadData.path);

    const fileUrl = urlData.publicUrl;

    // Check if user already has a resume analysis
    const { data: existing } = await supabase
      .from("resume_analyses")
      .select("id, file_url")
      .eq("user_id", userId)
      .single();

    let recordId: string;

    if (existing) {
      // Delete old file from storage if exists
      if (existing.file_url) {
        const oldPath = existing.file_url.split(`${RESUME_BUCKET}/`)[1];
        if (oldPath) {
          await supabase.storage.from(RESUME_BUCKET).remove([oldPath]).catch(() => {});
        }
      }

      // Update existing record
      const { data: updated, error: updateError } = await supabase
        .from("resume_analyses")
        .update({
          file_name: file.originalname,
          file_url: fileUrl,
          file_type: file.mimetype,
          status: "processing",
          ats_score: null,
          feedback: null,
          suggestions: [],
          analyzed_at: null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error(`Failed to update resume record: ${updateError.message}`);
      }
      recordId = updated.id;
    } else {
      // Create new record
      const { data: inserted, error: insertError } = await supabase
        .from("resume_analyses")
        .insert({
          user_id: userId,
          file_name: file.originalname,
          file_url: fileUrl,
          file_type: file.mimetype,
          status: "processing",
          ats_score: null,
          feedback: null,
          suggestions: [],
          analyzed_at: null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`Failed to create resume record: ${insertError.message}`);
      }
      recordId = inserted.id;
    }

    // Extract text using Gemini OCR
    const geminiMime = getGeminiMimeType(file.mimetype);
    const ocrResult = await extractTextFromResume(file.buffer, geminiMime);
    if (!ocrResult.success) {
      await supabase
        .from("resume_analyses")
        .update({ status: "ocr_failed" })
        .eq("id", recordId);
      throw new Error(ocrResult.error || "Failed to extract text from resume");
    }

    // Analyze resume with ATS
    const analysis = await analyzeResumeATS(ocrResult.text, jobDescription);
    const feedback = formatFeedback(analysis);

    // Update record with analysis results
    const { data: finalRecord, error: updateError } = await supabase
      .from("resume_analyses")
      .update({
        ats_score: analysis.atsScore,
        feedback: feedback,
        suggestions: analysis.suggestions,
        status: "completed",
        analyzed_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error(`Failed to update analysis: ${updateError.message}`);
    }

    // Update user's resume_score
    await supabase
      .from("users")
      .update({ resume_score: analysis.atsScore })
      .eq("id", userId);

    return finalRecord;
  },

  /**
   * Get user's resume analysis
   */
  getAnalysis: async (userId: string): Promise<ResumeAnalysisResult> => {
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new NotFoundError("No resume analysis found");
    }

    return data;
  },

  /**
   * Re-analyze existing resume with optional job description
   */
  reAnalyze: async (
    userId: string,
    jobDescription?: string
  ): Promise<ResumeAnalysisResult> => {
    const { data: existing, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !existing) {
      throw new NotFoundError("No resume found. Please upload a resume first.");
    }

    // Update status to processing
    await supabase
      .from("resume_analyses")
      .update({
        status: "processing",
        ats_score: null,
        feedback: null,
        suggestions: [],
        analyzed_at: null,
      })
      .eq("id", existing.id);

    // Download file from storage for re-OCR
    const filePath = existing.file_url.split(`${RESUME_BUCKET}/`)[1];
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error("Failed to download resume for re-analysis");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const geminiMime = getGeminiMimeType(existing.file_type);

    // Re-extract text
    const ocrResult = await extractTextFromResume(buffer, geminiMime);
    if (!ocrResult.success) {
      await supabase
        .from("resume_analyses")
        .update({ status: "ocr_failed" })
        .eq("id", existing.id);
      throw new Error(ocrResult.error || "Failed to extract text from resume");
    }

    // Re-analyze
    const analysis = await analyzeResumeATS(ocrResult.text, jobDescription);
    const feedback = formatFeedback(analysis);

    // Update record
    const { data: updated, error: updateError } = await supabase
      .from("resume_analyses")
      .update({
        ats_score: analysis.atsScore,
        feedback: feedback,
        suggestions: analysis.suggestions,
        status: "completed",
        analyzed_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update analysis: ${updateError.message}`);
    }

    // Update user's resume_score
    await supabase
      .from("users")
      .update({ resume_score: analysis.atsScore })
      .eq("id", userId);

    return updated;
  },

  /**
   * Get suggestions for a specific job description
   */
  getSuggestions: async (
    userId: string,
    jobDescription: string
  ): Promise<{
    ats_score: number;
    suggestions: string[];
    missingKeywords: string[];
  }> => {
    const { data: existing, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !existing) {
      throw new NotFoundError("No resume found. Please upload a resume first.");
    }

    // Download and extract text again for fresh analysis
    const filePath = existing.file_url.split(`${RESUME_BUCKET}/`)[1];
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error("Failed to download resume");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const geminiMime = getGeminiMimeType(existing.file_type);

    const ocrResult = await extractTextFromResume(buffer, geminiMime);
    if (!ocrResult.success) {
      throw new Error(ocrResult.error || "Failed to extract text from resume");
    }
    const analysis = await analyzeResumeATS(ocrResult.text, jobDescription);

    return {
      ats_score: analysis.atsScore,
      suggestions: analysis.suggestions,
      missingKeywords: analysis.missingKeywords,
    };
  },

  /**
   * Delete resume analysis
   */
  deleteAnalysis: async (userId: string): Promise<void> => {
    const { data: existing, error: fetchError } = await supabase
      .from("resume_analyses")
      .select("file_url")
      .eq("user_id", userId)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundError("No resume found");
    }

    // Delete from storage
    if (existing.file_url) {
      const filePath = existing.file_url.split(`${RESUME_BUCKET}/`)[1];
      if (filePath) {
        await supabase.storage.from(RESUME_BUCKET).remove([filePath]);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from("resume_analyses")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;

    // Reset user's resume_score
    await supabase.from("users").update({ resume_score: null }).eq("id", userId);
  },
};
