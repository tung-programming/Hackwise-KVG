"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Interests routes
const express_1 = require("express");
const interests_controller_1 = require("./interests.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const router = (0, express_1.Router)();
router.use(auth_guard_1.authGuard);
router.get("/", interests_controller_1.interestsController.getInterests);
router.get("/:id", interests_controller_1.interestsController.getInterest);
router.patch("/:id/accept", interests_controller_1.interestsController.acceptInterest);
router.patch("/:id/reject", interests_controller_1.interestsController.rejectInterest);
router.get("/:id/progress", interests_controller_1.interestsController.getProgress);
exports.default = router;
//# sourceMappingURL=interests.routes.js.map