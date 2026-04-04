// ATS Resume Analyzer using Groq
import Groq from "groq-sdk";
import { env } from "../../config/env";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

console.log("✅ Groq ATS Analyzer initialized");

export interface ATSAnalysis {
  atsScore: number;
  keywordMatch: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  missingKeywords: string[];
}

export interface ATSFeedback {
  overall: string;
  sections: ATSAnalysis["sections"];
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
}

/**
 * Analyze resume for ATS compatibility using Groq
 */
export const analyzeResumeATS = async (
  resumeContent: string,
  jobDescription?: string
): Promise<ATSAnalysis> => {
  const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility${jobDescription ? " against the provided job description" : ""}.

Resume:
${resumeContent}

${jobDescription ? `Job Description:\n${jobDescription}` : ""}

Provide a comprehensive analysis in JSON format:
{
  "atsScore": number (0-100, overall ATS compatibility),
  "keywordMatch": number (0-100, keyword matching percentage),
  "sections": [
    {"name": "Contact Info", "score": 85, "feedback": "..."},
    {"name": "Experience", "score": 90, "feedback": "..."},
    {"name": "Skills", "score": 75, "feedback": "..."},
    {"name": "Education", "score": 80, "feedback": "..."}
  ],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "suggestions": ["actionable suggestion 1", "suggestion 2"],
  "missingKeywords": ["keyword1", "keyword2"]
}

Be constructive and specific. Return ONLY valid JSON.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) analyzer. Analyze resumes and provide detailed, actionable feedback in JSON format only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    
    console.log("✅ ATS analysis completed via Groq");
    return analysis;
  } catch (error) {
    console.error("ATS analysis error:", error);
    throw new Error("ATS analysis provider is unavailable");
  }
};

/**
 * Convert ATSAnalysis to database-friendly feedback format
 */
export const formatFeedback = (analysis: ATSAnalysis): ATSFeedback => ({
  overall: `Your resume scored ${analysis.atsScore}/100 for ATS compatibility with ${analysis.keywordMatch}% keyword match.`,
  sections: analysis.sections,
  strengths: analysis.strengths,
  improvements: analysis.improvements,
  missingKeywords: analysis.missingKeywords,
});
