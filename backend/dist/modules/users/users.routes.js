"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Users routes
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const auth_middleware_1 = require("../auth/auth.middleware");
const users_schema_1 = require("./users.schema");
const router = (0, express_1.Router)();
// Public routes
router.get("/:id/public", users_controller_1.usersController.getPublicProfile);
// Protected routes
router.use(auth_guard_1.authGuard);
router.get("/profile", users_controller_1.usersController.getProfile);
router.patch("/profile", (0, auth_middleware_1.validateRequest)(users_schema_1.updateProfileSchema), users_controller_1.usersController.updateProfile);
router.get("/stats", users_controller_1.usersController.getStats);
router.delete("/account", users_controller_1.usersController.deleteAccount);
exports.default = router;
//# sourceMappingURL=users.routes.js.map