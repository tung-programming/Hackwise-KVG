export declare const interestsService: {
    getUserInterests: (userId: string) => Promise<any[]>;
    getInterest: (userId: string, interestId: string) => Promise<any>;
    acceptInterest: (userId: string, interestId: string) => Promise<{
        interest: any;
        message: string;
    }>;
    rejectInterest: (userId: string, interestId: string) => Promise<any>;
    getProgress: (userId: string, interestId: string) => Promise<{
        interest_id: any;
        name: any;
        progress_pct: any;
        is_completed: any;
        courses: {
            completed: number;
            total: number;
            items: {
                id: any;
                name: any;
                is_completed: any;
                is_locked: any;
            }[];
        };
        projects: {
            completed: number;
            total: number;
            items: {
                id: any;
                name: any;
                is_completed: any;
                is_locked: any;
                is_validated: any;
            }[];
        };
    }>;
    canAddNewInterests: (userId: string) => Promise<boolean>;
};
//# sourceMappingURL=interests.service.d.ts.map