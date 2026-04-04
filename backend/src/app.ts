// Express app setup
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/logger";
import { rateLimiter } from "./middleware/rate-limiter";
import { env } from "./config/env";

// Import routes
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import onboardingRoutes from "./modules/onboarding/onboarding.routes";
import historyRoutes from "./modules/history/history.routes";
import interestsRoutes from "./modules/interests/interests.routes";
import coursesRoutes from "./modules/courses/courses.routes";
import projectsRoutes from "./modules/projects/projects.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes";
import resumeRoutes from "./modules/resume/resume.routes";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(rateLimiter);

// API Root - Documentation
app.get("/api", (req, res) => {
  res.json({
    name: "CourseHive API",
    version: "1.0.0",
    description: "Gamified learning platform backend",
    endpoints: {
      auth: "/api/auth - Authentication (handled by Supabase)",
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
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/interests", interestsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

export default app;
