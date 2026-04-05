export interface RoadmapCourseNode {
    name: string;
    description: string;
    resourceUrl: string;
    resourceTitle: string;
    estimatedHours: number;
}
export interface RoadmapProjectIdea {
    name: string;
    description: string;
    difficulty: "easy" | "medium";
    estimatedHours: number;
    xpReward: number;
    bonusXp: number;
    evaluationCriteria: string;
}
export interface GeneratedRoadmap {
    courses: RoadmapCourseNode[];
    projects: RoadmapProjectIdea[];
}
export declare function generateCourseRoadmap(interestName: string, field: string, type: string, matchedKeywords: string[]): Promise<GeneratedRoadmap>;
export declare function toCourseRow(node: RoadmapCourseNode, index: number, userId: string, interestId: string): {
    interest_id: string;
    user_id: string;
    name: string;
    description: string;
    resource_url: string;
    node_order: number;
    is_locked: boolean;
    is_completed: boolean;
    roadmap_data: {
        duration: string;
        difficulty: "beginner" | "intermediate" | "advanced";
        resourceTitle: string;
        estimatedHours: number;
    };
};
export declare function toProjectRow(project: RoadmapProjectIdea, userId: string, interestId: string): {
    interest_id: string;
    user_id: string;
    name: string;
    description: string;
    difficulty: "easy" | "medium";
    is_locked: boolean;
    is_completed: boolean;
    is_validated: boolean;
    submission_data: {
        estimatedHours: number;
        xpReward: number;
        bonusXp: number;
        evaluationCriteria: string;
    };
};
//# sourceMappingURL=roadmap.generator.d.ts.map