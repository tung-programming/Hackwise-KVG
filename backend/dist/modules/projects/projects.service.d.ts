export declare const projectsService: {
    getUserProjects: (userId: string) => Promise<any[]>;
    getProject: (userId: string, projectId: string) => Promise<any>;
    submitProject: (userId: string, projectId: string, submissionUrl: string, submissionData?: any) => Promise<{
        project: any;
        message: string;
    }>;
    getValidation: (userId: string, projectId: string) => Promise<{
        status: string;
        result: {
            isValid: any;
            score: number;
            feedback: any;
            suggestions: never[];
        } | undefined;
        xpAwarded: any;
        project: {
            id: any;
            name: any;
        };
    }>;
};
//# sourceMappingURL=projects.service.d.ts.map