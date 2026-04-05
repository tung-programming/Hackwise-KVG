interface Project {
    title: string;
    description: string;
    repoUrl?: string | null;
    liveUrl?: string | null;
    technologies: string[];
}
interface ValidationResult {
    isValid: boolean;
    score: number;
    feedback: string[];
    suggestions: string[];
}
export declare const validateProjectWithAI: (project: Project) => Promise<ValidationResult>;
export {};
//# sourceMappingURL=project.validator.d.ts.map