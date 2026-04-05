"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesController = void 0;
const courses_service_1 = require("./courses.service");
const api_response_1 = require("../../utils/api-response");
exports.coursesController = {
    // Get all courses for an interest
    getCoursesByInterest: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { interestId } = req.query;
            if (!interestId) {
                return res.status(400).json(api_response_1.ApiResponse.error("interestId query param required", 400));
            }
            const courses = await courses_service_1.coursesService.getCoursesByInterest(userId, interestId);
            res.json(api_response_1.ApiResponse.success(courses));
        }
        catch (error) {
            next(error);
        }
    },
    // Get single course
    getCourse: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const course = await courses_service_1.coursesService.getCourse(userId, id);
            res.json(api_response_1.ApiResponse.success(course));
        }
        catch (error) {
            next(error);
        }
    },
    // Mark course as completed
    completeCourse: async (req, res, next) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const result = await courses_service_1.coursesService.completeCourse(userId, id);
            res.json(api_response_1.ApiResponse.success(result));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=courses.controller.js.map