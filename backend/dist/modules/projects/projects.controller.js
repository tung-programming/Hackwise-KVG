"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsController = void 0;
const projects_service_1 = require("./projects.service");
const api_response_1 = require("../../utils/api-response");
exports.projectsController = {
    // Get all projects for user
    getProjects: async (req, res, next) => {
        try {
            const userId = req.userId;
            const projects = await projects_service_1.projectsService.getUserProjects(userId);
            res.json(api_response_1.ApiResponse.success(projects));
        }
        catch (error) {
            next(error);
        }
    },
    // Get single project
    getProject: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const project = await projects_service_1.projectsService.getProject(userId, id);
            res.json(api_response_1.ApiResponse.success(project));
        }
        catch (error) {
            next(error);
        }
    },
    // Submit project
    submitProject: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { submission_url, submission_data } = req.body;
            if (!submission_url) {
                return res.status(400).json(api_response_1.ApiResponse.error("submission_url is required", 400));
            }
            const result = await projects_service_1.projectsService.submitProject(userId, id, submission_url, submission_data);
            // Return 202 for async validation
            res.status(202).json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
    // Get validation result
    getValidation: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const validation = await projects_service_1.projectsService.getValidation(userId, id);
            res.json(api_response_1.ApiResponse.success(validation));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=projects.controller.js.map