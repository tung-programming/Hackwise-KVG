"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyController = void 0;
const history_service_1 = require("./history.service");
const api_response_1 = require("../../utils/api-response");
exports.historyController = {
    uploadHistory: async (req, res, next) => {
        try {
            const userId = req.userId;
            const file = req.file;
            if (!file) {
                return res.status(400).json(api_response_1.ApiResponse.error("No file uploaded", 400));
            }
            const result = await history_service_1.historyService.uploadHistory(userId, file);
            // Return 202 Accepted for async processing
            res.status(202).json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
    getHistory: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { page = 1, limit = 20 } = req.query;
            const history = await history_service_1.historyService.getHistory(userId, Number(page), Number(limit));
            res.json(api_response_1.ApiResponse.success(history));
        }
        catch (error) {
            next(error);
        }
    },
    getStatus: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const status = await history_service_1.historyService.getHistoryStatus(userId, id);
            res.json(api_response_1.ApiResponse.success(status));
        }
        catch (error) {
            next(error);
        }
    },
    deleteHistory: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const result = await history_service_1.historyService.deleteHistory(userId, id);
            res.json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=history.controller.js.map