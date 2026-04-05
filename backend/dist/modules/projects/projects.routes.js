"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Projects routes
const express_1 = require("express");
const projects_controller_1 = require("./projects.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const auth_middleware_1 = require("../auth/auth.middleware");
const projects_schema_1 = require("./projects.schema");
const router = (0, express_1.Router)();
router.use(auth_guard_1.authGuard);
// GET /projects - Get all user projects
router.get("/", projects_controller_1.projectsController.getProjects);
// GET /projects/:id - Get single project
router.get("/:id", projects_controller_1.projectsController.getProject);
// POST /projects/:id/submit - Submit project for validation
router.post("/:id/submit", (0, auth_middleware_1.validateRequest)(projects_schema_1.submitProjectSchema), projects_controller_1.projectsController.submitProject);
// GET /projects/:id/validation - Get validation result
router.get("/:id/validation", projects_controller_1.projectsController.getValidation);
exports.default = router;
//# sourceMappingURL=projects.routes.js.map