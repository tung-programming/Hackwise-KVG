interface RoadmapCourse {
    name: string;
    description: string;
    resource_url: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}
interface RoadmapProject {
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
interface RoadmapResult {
    courses: RoadmapCourse[];
    projects: RoadmapProject[];
}
export declare const generateCourseRoadmap: (interestName: string, field: string, type: string) => Promise<RoadmapResult>;
export {};
//# sourceMappingURL=roadmap.generator.d.ts.map