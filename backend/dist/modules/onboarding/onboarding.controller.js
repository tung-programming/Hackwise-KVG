"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingController = void 0;
const onboarding_service_1 = require("./onboarding.service");
const api_response_1 = require("../../utils/api-response");
exports.onboardingController = {
    getFields: async (req, res, next) => {
        try {
            const fields = await onboarding_service_1.onboardingService.getFields();
            res.json(api_response_1.ApiResponse.success(fields));
        }
        catch (error) {
            next(error);
        }
    },
    getTypes: async (req, res, next) => {
        try {
            const { field } = req.params;
            const types = await onboarding_service_1.onboardingService.getTypes(field);
            res.json(api_response_1.ApiResponse.success(types));
        }
        catch (error) {
            next(error);
        }
    },
    complete: async (req, res, next) => {
        try {
            const userId = req.userId;
            const email = req.userEmail;
            const { field, type, username, auth_provider, auth_provider_id } = req.body;
            const result = await onboarding_service_1.onboardingService.complete(userId, email, {
                field,
                type,
                username,
                auth_provider,
                auth_provider_id,
            });
            res.json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
    checkStatus: async (req, res, next) => {
        try {
            const userId = req.userId;
            const status = await onboarding_service_1.onboardingService.checkStatus(userId);
            res.json(api_response_1.ApiResponse.success(status));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=onboarding.controller.js.map