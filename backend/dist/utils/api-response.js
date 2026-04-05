"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
// Standardized response format
class ApiResponse {
    static success(data, message = 'Success') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }
    static error(message, statusCode = 500, errors) {
        return {
            success: false,
            message,
            statusCode,
            errors,
            timestamp: new Date().toISOString(),
        };
    }
    static paginated(data, pagination) {
        return {
            success: true,
            message: 'Success',
            data,
            pagination,
            timestamp: new Date().toISOString(),
        };
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.js.map