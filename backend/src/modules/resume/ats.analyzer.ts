// Gemini ATS analysis
import geminiPool from '../../config/gemini';

interface ATSAnalysis {
  atsScore: number;
  keywordMatch: number;
  scoreBreakdown: {
    contactInfo: number;
    formatting: number;
    experience: number;
    skills: number;
    education: number;
    keywords: number;
  };
  sections: {
    name: string;
    score: number;
    maxScore?: number;
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

  const prompt = `You are a strict ATS (Applicant Tracking System) scoring engine. You must evaluate this resume objectively using the exact rubric below. Do NOT default to average scores. A weak resume should score 20-40. A decent one 50-70. Only exceptional resumes score above 80.

RESUME TEXT:
---START RESUME---
${resumeContent}
---END RESUME---

${jobDescription ? `JOB DESCRIPTION TO MATCH AGAINST:\n---START JOB---\n${jobDescription}\n---END JOB---` : 'No job description provided — evaluate against general industry standards.'}

SCORING RUBRIC — evaluate each category independently:

1. CONTACT INFO (out of 10):
   - Has full name: +2
   - Has email: +2
   - Has phone number: +2
   - Has LinkedIn or portfolio URL: +2
   - Has location (city/state): +2
   - Missing any of the above: 0 for that item
   - Score this section HONESTLY. If there's no phone number, don't give full marks.

2. FORMATTING & STRUCTURE (out of 15):
   - Uses standard section headings (Experience, Education, Skills, etc.): +5
   - Sections are in logical order: +3
   - No tables, columns, or graphics (ATS can't parse these — detect from text extraction quality): +3
   - Consistent date formatting: +2
   - Appropriate length (1 page for <3 years exp, 2 pages for more): +2

3. EXPERIENCE (out of 25):
   - Has clear job titles: +5
   - Has company names: +3
   - Has dates for each role: +3
   - Uses strong action verbs (Built, Designed, Led, Implemented — NOT Helped, Assisted, Worked on): +5
   - Includes quantifiable achievements with numbers (%, $, counts): +5
     * "Increased revenue by 30%" = full marks
     * "Helped improve performance" = 0 marks
   - Relevant to ${jobDescription ? 'the job description' : 'their stated field'}: +4
   - If NO experience section exists: score 0 for entire category

4. SKILLS (out of 20):
   - Has a dedicated skills section: +4
   - Lists technical/hard skills: +4
   - Lists tools and technologies by name (not vague like "various tools"): +4
   ${jobDescription ? `- Contains keywords from the job description: +8 (count matching keywords, score proportionally — 0 matches = 0, 1-3 matches = 2, 4-6 = 4, 7-10 = 6, 10+ = 8)` : '- Contains industry-relevant keywords for their field: +8'}
   - If NO skills section exists: score maximum 4

5. EDUCATION (out of 10):
   - Has degree name: +3
   - Has institution name: +3
   - Has graduation year: +2
   - Has relevant coursework or GPA (if student/recent grad): +2
   - If NO education section: score 0

6. KEYWORD OPTIMIZATION (out of 20):
   ${jobDescription ? `- Count how many UNIQUE keywords from the job description appear in the resume
   - 0-2 matches: 0-4 points
   - 3-5 matches: 5-8 points
   - 6-10 matches: 9-14 points
   - 11-15 matches: 15-17 points
   - 16+ matches: 18-20 points
   - List EVERY keyword you checked in missingKeywords if not found` : `- Evaluate keyword density for their industry
   - Generic buzzwords only ("team player", "hard worker"): 0-5 points
   - Some specific technical terms: 6-12 points
   - Rich specific terminology matching their field: 13-20 points`}

CALCULATION:
- Add all 6 category scores. The sum IS the atsScore (out of 100).
- keywordMatch = (keywords found in resume / total important keywords ${jobDescription ? 'from job description' : 'for their field'}) * 100, rounded to nearest integer.
- DO NOT round the atsScore to a nice number. If the math gives 47, return 47. Not 50. Not 45.

IMPORTANT RULES:
- A resume with no experience section CANNOT score above 60 total.
- A resume with no skills section CANNOT score above 65 total.
- A resume that is clearly a template with placeholder text scores 10-20.
- A student resume with projects but no work experience should score 35-55 depending on quality.
- Be HARSH on missing quantifiable achievements. "Improved system performance" without numbers gets 0 credit.
- If a job description is provided and the resume has almost no matching keywords, keywordMatch should be below 30.

Respond with ONLY valid JSON. No markdown fences, no explanation, no text before or after the JSON:

{
  "atsScore": <number — the SUM of all 6 categories>,
  "keywordMatch": <number — calculated as described above>,
  "scoreBreakdown": {
    "contactInfo": <number out of 10>,
    "formatting": <number out of 15>,
    "experience": <number out of 25>,
    "skills": <number out of 20>,
    "education": <number out of 10>,
    "keywords": <number out of 20>
  },
  "sections": [
    {
      "name": "Contact Information",
      "score": <same as contactInfo above>,
      "maxScore": 10,
      "feedback": "<1-2 sentences — what's present and what's missing>"
    },
    {
      "name": "Formatting & Structure",
      "score": <same as formatting above>,
      "maxScore": 15,
      "feedback": "<1-2 sentences>"
    },
    {
      "name": "Work Experience",
      "score": <same as experience above>,
      "maxScore": 25,
      "feedback": "<1-2 sentences — mention if action verbs and numbers are weak>"
    },
    {
      "name": "Skills",
      "score": <same as skills above>,
      "maxScore": 20,
      "feedback": "<1-2 sentences — mention specific missing skills if job description provided>"
    },
    {
      "name": "Education",
      "score": <same as education above>,
      "maxScore": 10,
      "feedback": "<1-2 sentences>"
    },
    {
      "name": "Keyword Optimization",
      "score": <same as keywords above>,
      "maxScore": 20,
      "feedback": "<1-2 sentences — mention how many keywords matched>"
    }
  ],
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific weakness 1>", "<specific weakness 2>", "<specific weakness 3>"],
  "suggestions": [
    "<actionable suggestion with an example — e.g. Change 'Helped with testing' to 'Executed 50+ test cases reducing bug rate by 20%'>",
    "<another specific suggestion>",
    "<another specific suggestion>"
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"]
}`;

  try {
    const response = await geminiPool.generateContent(prompt);

    // Clean response — strip markdown fences and any preamble
    let cleaned = response.trim();
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Remove any text before the first { and after the last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const analysis = JSON.parse(cleaned);

    // Validate the score is actually the sum of breakdown (catch hallucinated scores)
    if (analysis.scoreBreakdown) {
      const calculatedScore =
        (analysis.scoreBreakdown.contactInfo || 0) +
        (analysis.scoreBreakdown.formatting || 0) +
        (analysis.scoreBreakdown.experience || 0) +
        (analysis.scoreBreakdown.skills || 0) +
        (analysis.scoreBreakdown.education || 0) +
        (analysis.scoreBreakdown.keywords || 0);

      // If Gemini's total doesn't match the sum, use the calculated one
      if (Math.abs(analysis.atsScore - calculatedScore) > 3) {
        analysis.atsScore = calculatedScore;
      }
    }

    // Validate keywordMatch is reasonable
    if (analysis.keywordMatch > 100) analysis.keywordMatch = 100;
    if (analysis.keywordMatch < 0) analysis.keywordMatch = 0;

    // Ensure sections have maxScore for frontend gauge rendering
    const expectedMaxScores: Record<string, number> = {
      'Contact Information': 10,
      'Formatting & Structure': 15,
      'Work Experience': 25,
      'Skills': 20,
      'Education': 10,
      'Keyword Optimization': 20,
    };
    if (analysis.sections) {
      analysis.sections = analysis.sections.map((s: any) => ({
        ...s,
        maxScore: s.maxScore || expectedMaxScores[s.name] || 20,
      }));
    }

    return analysis;
  } catch (error) {
    console.error('ATS analysis error:', error);

    // Retry once with a stricter prompt
    try {
      const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the JSON object starting with { and ending with }. No other text.`;
      const retryResponse = await geminiPool.generateContent(retryPrompt);
      let cleaned = retryResponse.trim();
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      return JSON.parse(cleaned);
    } catch (retryError) {
      console.error('ATS retry also failed:', retryError);
      return {
        atsScore: 0,
        keywordMatch: 0,
        scoreBreakdown: {
          contactInfo: 0,
          formatting: 0,
          experience: 0,
          skills: 0,
          education: 0,
          keywords: 0,
        },
        sections: [
          { name: 'Error', score: 0, maxScore: 100, feedback: 'Analysis failed. Please try again.' },
        ],
        strengths: [],
        improvements: ['Analysis could not be completed — please retry'],
        suggestions: ['Try uploading the resume again'],
        missingKeywords: [],
      };
    }
  }
};