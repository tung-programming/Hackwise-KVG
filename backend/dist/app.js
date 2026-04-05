"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express app setup
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = require("./middleware/error-handler");
const logger_1 = require("./middleware/logger");
const rate_limiter_1 = require("./middleware/rate-limiter");
const env_1 = require("./config/env");
// Import routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const onboarding_routes_1 = __importDefault(require("./modules/onboarding/onboarding.routes"));
const history_routes_1 = __importDefault(require("./modules/history/history.routes"));
const interests_routes_1 = __importDefault(require("./modules/interests/interests.routes"));
const courses_routes_1 = __importDefault(require("./modules/courses/courses.routes"));
const projects_routes_1 = __importDefault(require("./modules/projects/projects.routes"));
const leaderboard_routes_1 = __importDefault(require("./modules/leaderboard/leaderboard.routes"));
const resume_routes_1 = __importDefault(require("./modules/resume/resume.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
app.use(rate_limiter_1.rateLimiter);
// API Root - Documentation
app.get("/api", (req, res) => {
    res.json({
        name: "CourseHive API",
        version: "1.0.0",
        description: "Gamified learning platform backend",
        endpoints: {
            auth: {
                "GET /api/auth/google": "Initiate Google OAuth (query: field, type, redirect_url)",
                "GET /api/auth/google/callback": "Google OAuth callback",
                "GET /api/auth/github": "Initiate GitHub OAuth (query: field, type, redirect_url)",
                "GET /api/auth/github/callback": "GitHub OAuth callback",
                "GET /api/auth/me": "Get current user (requires Bearer token)",
                "POST /api/auth/refresh": "Refresh access token",
                "POST /api/auth/logout": "Logout user",
            },
            users: "/api/users - User profiles and stats",
            onboarding: "/api/onboarding - Field and type selection",
            history: "/api/history - Browsing history upload",
            interests: "/api/interests - Interest recommendations",
            courses: "/api/courses - Course roadmaps",
            projects: "/api/projects - Project submissions",
            leaderboard: "/api/leaderboard - Rankings",
            resume: "/api/resume - Resume ATS analysis",
        },
        health: "/health",
        docs: "See README.md for full documentation",
    });
});
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/onboarding", onboarding_routes_1.default);
app.use("/api/history", history_routes_1.default);
app.use("/api/interests", interests_routes_1.default);
app.use("/api/courses", courses_routes_1.default);
app.use("/api/projects", projects_routes_1.default);
app.use("/api/leaderboard", leaderboard_routes_1.default);
app.use("/api/resume", resume_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Error handler
app.use(error_handler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map