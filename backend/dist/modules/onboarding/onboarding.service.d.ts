export declare const onboardingService: {
    getFields: () => Promise<{
        id: string;
        name: string;
        icon: string;
    }[]>;
    getTypes: (field: string) => Promise<{
        id: string;
        name: string;
    }[]>;
    complete: (userId: string, email: string, data: {
        field: string;
        type: string;
        username: string;
        auth_provider: string;
        auth_provider_id: string;
    }) => Promise<{
        user: any;
        message: string;
    }>;
    checkStatus: (userId: string) => Promise<{
        completed: boolean;
        field?: undefined;
        type?: undefined;
    } | {
        completed: boolean;
        field: any;
        type: any;
    }>;
};
//# sourceMappingURL=onboarding.service.d.ts.map