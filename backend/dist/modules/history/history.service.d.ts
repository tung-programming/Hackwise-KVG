export declare const historyService: {
    uploadHistory: (userId: string, file: Express.Multer.File) => Promise<{
        id: any;
        status: string;
        message: string;
    }>;
    getHistory: (userId: string, page?: number, limit?: number) => Promise<{
        entries: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getHistoryStatus: (userId: string, historyId: string) => Promise<{
        interests: any[] | null;
        id: any;
        status: any;
        processed_at: any;
        file_name: any;
    }>;
    deleteHistory: (userId: string, historyId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=history.service.d.ts.map