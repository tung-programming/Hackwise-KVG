"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Courses routes
const express_1 = require("express");
const courses_controller_1 = require("./courses.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const router = (0, express_1.Router)();
router.use(auth_guard_1.authGuard);
router.get("/", courses_controller_1.coursesController.getCoursesByInterest); // ?interestId=X
router.get("/:id", courses_controller_1.coursesController.getCourse);
router.patch("/:id/complete", courses_controller_1.coursesController.completeCourse);
exports.default = router;
//# sourceMappingURL=courses.routes.js.map