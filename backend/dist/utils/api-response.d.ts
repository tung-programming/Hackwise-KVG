export declare class ApiResponse {
    static success<T>(data: T, message?: string): {
        success: boolean;
        message: string;
        data: T;
        timestamp: string;
    };
    static error(message: string, statusCode?: number, errors?: any): {
        success: boolean;
        message: string;
        statusCode: number;
        errors: any;
        timestamp: string;
    };
    static paginated<T>(data: T[], pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    }): {
        success: boolean;
        message: string;
        data: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        timestamp: string;
    };
}
//# sourceMappingURL=api-response.d.ts.map