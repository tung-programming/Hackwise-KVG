"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interestsController = void 0;
const interests_service_1 = require("./interests.service");
const api_response_1 = require("../../utils/api-response");
exports.interestsController = {
    // Get all interests for current user
    getInterests: async (req, res, next) => {
        try {
            const userId = req.userId;
            const interests = await interests_service_1.interestsService.getUserInterests(userId);
            res.json(api_response_1.ApiResponse.success(interests));
        }
        catch (error) {
            next(error);
        }
    },
    // Get single interest with courses and projects
    getInterest: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const interest = await interests_service_1.interestsService.getInterest(userId, id);
            res.json(api_response_1.ApiResponse.success(interest));
        }
        catch (error) {
            next(error);
        }
    },
    // Accept interest - triggers roadmap generation
    acceptInterest: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const result = await interests_service_1.interestsService.acceptInterest(userId, id);
            // Return 202 for async processing
            res.status(202).json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
    // Reject interest
    rejectInterest: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const interest = await interests_service_1.interestsService.rejectInterest(userId, id);
            res.json(api_response_1.ApiResponse.success(interest));
        }
        catch (error) {
            next(error);
        }
    },
    // Get progress for an interest
    getProgress: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const progress = await interests_service_1.interestsService.getProgress(userId, id);
            res.json(api_response_1.ApiResponse.success(progress));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=interests.controller.js.map