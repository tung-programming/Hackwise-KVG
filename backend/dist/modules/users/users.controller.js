"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const users_service_1 = require("./users.service");
const api_response_1 = require("../../utils/api-response");
exports.usersController = {
    getProfile: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await users_service_1.usersService.getProfile(userId);
            res.json(api_response_1.ApiResponse.success(user));
        }
        catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await users_service_1.usersService.updateProfile(userId, req.body);
            res.json(api_response_1.ApiResponse.success(user));
        }
        catch (error) {
            next(error);
        }
    },
    getStats: async (req, res, next) => {
        try {
            const userId = req.userId;
            const stats = await users_service_1.usersService.getStats(userId);
            res.json(api_response_1.ApiResponse.success(stats));
        }
        catch (error) {
            next(error);
        }
    },
    getPublicProfile: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await users_service_1.usersService.getPublicProfile(id);
            res.json(api_response_1.ApiResponse.success(user));
        }
        catch (error) {
            next(error);
        }
    },
    deleteAccount: async (req, res, next) => {
        try {
            const userId = req.userId;
            await users_service_1.usersService.deleteAccount(userId);
            res.json(api_response_1.ApiResponse.success({ message: "Account deleted successfully" }));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=users.controller.js.map