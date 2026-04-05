"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Onboarding routes
const express_1 = require("express");
const onboarding_controller_1 = require("./onboarding.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const auth_middleware_1 = require("../auth/auth.middleware");
const onboarding_schema_1 = require("./onboarding.schema");
const router = (0, express_1.Router)();
// Public routes (get field/type options)
router.get("/fields", onboarding_controller_1.onboardingController.getFields);
router.get("/types/:field", onboarding_controller_1.onboardingController.getTypes);
// Protected routes
router.use(auth_guard_1.authGuard);
router.get("/status", onboarding_controller_1.onboardingController.checkStatus);
router.post("/complete", (0, auth_middleware_1.validateRequest)(onboarding_schema_1.completeOnboardingSchema), onboarding_controller_1.onboardingController.complete);
exports.default = router;
//# sourceMappingURL=onboarding.routes.js.map