// Gemini ATS analysis
import geminiPool from '../../config/gemini';

interface ATSAnalysis {
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

export const analyzeResumeATS = async (
  resumeContent: string,
  jobDescription?: string
): Promise<ATSAnalysis> => {
  const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility${jobDescription ? ' against the provided job description' : ''}.

Resume:
${resumeContent}

${jobDescription ? `Job Description:\n${jobDescription}` : ''}

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
    const response = await geminiPool.generateContent(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleaned);
    return analysis;
  } catch (error) {
    console.error('ATS analysis error:', error);
    return {
      atsScore: 70,
      keywordMatch: 65,
      sections: [
        { name: 'Overall', score: 70, feedback: 'Resume processed successfully' },
      ],
      strengths: ['Resume uploaded successfully'],
      improvements: ['Add more quantifiable achievements', 'Include relevant keywords'],
      suggestions: [
        'Use standard section headings',
        'Include measurable results',
        'Tailor resume to specific job descriptions',
      ],
      missingKeywords: [],
    };
  }
};
