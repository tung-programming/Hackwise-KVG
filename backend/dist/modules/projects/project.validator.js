"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectWithAI = void 0;
// Gemini project validation
const gemini_1 = __importDefault(require("../../config/gemini"));
const validateProjectWithAI = async (project) => {
    const prompt = `Evaluate this project submission for a learning platform:

Title: ${project.title}
Description: ${project.description}
Repository: ${project.repoUrl || 'Not provided'}
Live Demo: ${project.liveUrl || 'Not provided'}
Technologies: ${project.technologies.join(', ')}

Evaluate based on:
1. Project completeness and description quality
2. Appropriate use of technologies
3. Whether it demonstrates learning

Return a JSON object:
{
  "isValid": boolean (true if project meets minimum standards),
  "score": number (1-100),
  "feedback": ["feedback item 1", "feedback item 2"],
  "suggestions": ["improvement suggestion 1", "suggestion 2"]
}

Be encouraging but honest. Return ONLY valid JSON.`;
    try {
        const response = await gemini_1.default.generateContent(prompt);
        const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
        const result = JSON.parse(cleaned);
        return result;
    }
    catch (error) {
        console.error('Project validation error:', error);
        return {
            isValid: true,
            score: 70,
            feedback: [
                'Project submitted successfully',
                'Unable to perform detailed AI analysis at this time',
            ],
            suggestions: [
                'Consider adding a README with setup instructions',
                'Include screenshots or a demo video',
            ],
        };
    }
};
exports.validateProjectWithAI = validateProjectWithAI;
//# sourceMappingURL=project.validator.js.map