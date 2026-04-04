// Resume service
import { supabase } from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import { analyzeResumeATS } from "./ats.analyzer";
import { uploadFile, deleteFile, getPublicUrl } from "../../config/storage";

export const resumeService = {
  // Upload resume to Supabase Storage and analyze
  uploadResume: async (userId: string, file: Express.Multer.File) => {
    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop() || "pdf";
    const filePath = `resumes/${userId}/${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const fileUrl = await uploadFile(filePath, file.buffer, file.mimetype);

    // Extract text content (for PDF this would need a PDF parser)
    // For now, store the file URL and process text extraction separately
    const resumeContent = file.mimetype.includes("text") ? file.buffer.toString("utf-8") : null;

    // Upsert resume record
    const { data: resume, error } = await supabase
      .from("resume_analyses")
      .upsert(
        {
          user_id: userId,
          file_name: file.originalname,
          file_url: fileUrl,
          file_type: file.mimetype,
          resume_text: resumeContent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return {
      id: resume.id,
      file_name: resume.file_name,
      file_url: resume.file_url,
      uploaded_at: resume.updated_at,
    };
  },

  // Get user's resume info
  getResume: async (userId: string) => {
    const { data: resume, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !resume) {
      throw new NotFoundError("No resume found");
    }

    return {
      id: resume.id,
      file_name: resume.file_name,
      file_url: resume.file_url,
      ats_score: resume.ats_score,
      analysis: resume.analysis,
      uploaded_at: resume.updated_at,
    };
  },

  // Analyze resume with Gemini
  analyzeResume: async (userId: string, jobDescription?: string) => {
    const { data: resume, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !resume) {
      throw new NotFoundError("No resume found");
    }

    if (!resume.resume_text) {
      throw new Error("Resume text not available. Please upload a text-based resume.");
    }

    // Analyze with Gemini
    const analysis = await analyzeResumeATS(resume.resume_text, jobDescription);

    // Store analysis result
    await supabase
      .from("resume_analyses")
      .update({
        ats_score: analysis.atsScore,
        analysis: analysis,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resume.id);

    // Update user's resume_score
    await supabase.from("users").update({ resume_score: analysis.atsScore }).eq("id", userId);

    return analysis;
  },

  // Get latest ATS score comparison
  getATSScore: async (userId: string, jobDescription: string) => {
    const { data: resume, error } = await supabase
      .from("resume_analyses")
      .select("resume_text, ats_score")
      .eq("user_id", userId)
      .single();

    if (error || !resume) {
      throw new NotFoundError("No resume found");
    }

    if (!resume.resume_text) {
      throw new Error("Resume text not available for analysis");
    }

    const analysis = await analyzeResumeATS(resume.resume_text, jobDescription);

    return {
      score: analysis.atsScore,
      keyword_match: analysis.keywordMatch,
      missing_keywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
    };
  },

  // Get all analyses for user
  getAnalysisHistory: async (userId: string) => {
    const { data: resume, error } = await supabase
      .from("resume_analyses")
      .select("id, file_name, ats_score, analysis, created_at, updated_at")
      .eq("user_id", userId)
      .single();

    if (error || !resume) {
      return null;
    }

    return resume;
  },

  // Delete resume
  deleteResume: async (userId: string) => {
    const { data: resume, error: fetchError } = await supabase
      .from("resume_analyses")
      .select("file_url")
      .eq("user_id", userId)
      .single();

    if (fetchError || !resume) {
      throw new NotFoundError("No resume found");
    }

    // Delete from storage
    if (resume.file_url) {
      const path = resume.file_url.split("/").slice(-3).join("/");
      await deleteFile(path).catch(console.error);
    }

    // Delete from database
    const { error } = await supabase.from("resume_analyses").delete().eq("user_id", userId);

    if (error) throw error;

    // Reset user's resume_score
    await supabase.from("users").update({ resume_score: null }).eq("id", userId);
  },
};
