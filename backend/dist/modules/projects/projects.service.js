"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsService = void 0;
// Projects service
const database_1 = require("../../config/database");
const errors_1 = require("../../utils/errors");
const project_validator_1 = require("./project.validator");
const XP_BY_DIFFICULTY = {
    easy: 100,
    medium: 250,
    hard: 500,
};
exports.projectsService = {
    // Get all projects for user
    getUserProjects: async (userId) => {
        const { data: projects, error } = await database_1.supabase
            .from("projects")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        return projects || [];
    },
    // Get single project
    getProject: async (userId, projectId) => {
        const { data: project, error } = await database_1.supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .eq("user_id", userId)
            .single();
        if (error || !project) {
            throw new errors_1.NotFoundError("Project not found");
        }
        return project;
    },
    // Submit project (URL + optional description)
    submitProject: async (userId, projectId, submissionUrl, submissionData) => {
        const { data: project, error: projectError } = await database_1.supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .eq("user_id", userId)
            .single();
        if (projectError || !project) {
            throw new errors_1.NotFoundError("Project not found");
        }
        if (project.is_locked) {
            throw new Error("Project is locked. Complete all courses first.");
        }
        // Update with submission
        const { data: updatedProject, error: updateError } = await database_1.supabase
            .from("projects")
            .update({
            submission_url: submissionUrl,
            submission_data: submissionData || {},
            updated_at: new Date().toISOString(),
        })
            .eq("id", projectId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        // Fire-and-forget validation
        validateProjectAsync(userId, projectId, updatedProject).catch((err) => {
            console.error("Project validation failed:", err);
        });
        return {
            project: updatedProject,
            message: "Project submitted. Validation in progress.",
        };
    },
    // Get validation result
    getValidation: async (userId, projectId) => {
        const { data: project, error } = await database_1.supabase
            .from("projects")
            .select("id, name, is_validated, is_completed, validation_feedback, xp_awarded")
            .eq("id", projectId)
            .eq("user_id", userId)
            .single();
        if (error || !project) {
            throw new errors_1.NotFoundError("Project not found");
        }
        const status = !project.is_validated
            ? "pending"
            : project.is_completed
                ? "validated"
                : "failed";
        return {
            status,
            result: project.is_validated && project.validation_feedback
                ? {
                    isValid: project.is_completed,
                    score: project.is_completed ? 80 : 40,
                    feedback: project.validation_feedback
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .slice(0, 8),
                    suggestions: [],
                }
                : undefined,
            xpAwarded: project.xp_awarded,
            project: {
                id: project.id,
                name: project.name,
            },
        };
    },
};
// Background validation function
async function validateProjectAsync(userId, projectId, project) {
    try {
        const validation = await (0, project_validator_1.validateProjectWithAI)({
            title: project.name,
            description: project.description,
            repoUrl: project.submission_url,
            liveUrl: null,
            technologies: [],
        });
        const isValid = validation.isValid && validation.score >= 60;
        const xpAwarded = isValid ? XP_BY_DIFFICULTY[project.difficulty] || 250 : 0;
        // Update project with validation result
        await database_1.supabase
            .from("projects")
            .update({
            is_validated: true,
            is_completed: isValid,
            completed_at: isValid ? new Date().toISOString() : null,
            validation_feedback: validation.feedback.join("\n") + "\n\nSuggestions:\n" + validation.suggestions.join("\n"),
            xp_awarded: xpAwarded,
            updated_at: new Date().toISOString(),
        })
            .eq("id", projectId);
        if (isValid) {
            // Award XP
            await database_1.supabase.rpc("increment_xp", { user_id: userId, xp_amount: xpAwarded });
            // Log activity
            await database_1.supabase.from("user_activity_log").upsert({
                user_id: userId,
                activity_type: "project_submitted",
                activity_date: new Date().toISOString().split("T")[0],
                metadata: { project_id: projectId, xp_awarded: xpAwarded },
            }, { onConflict: "user_id,activity_type,activity_date" });
            // Update streak
            await database_1.supabase.rpc("update_user_streak", { p_user_id: userId });
            // Refresh leaderboard
            await database_1.supabase.rpc("refresh_leaderboard");
            // If all projects for this interest are completed, close the interest.
            const { data: allProjects } = await database_1.supabase
                .from("projects")
                .select("is_completed")
                .eq("interest_id", project.interest_id);
            const allProjectsCompleted = allProjects?.every((p) => p.is_completed) || false;
            if (allProjectsCompleted) {
                await database_1.supabase
                    .from("interests")
                    .update({
                    is_completed: true,
                    progress_pct: 100,
                    updated_at: new Date().toISOString(),
                })
                    .eq("id", project.interest_id);
            }
        }
        console.log(`✅ Project ${projectId} validated. Valid: ${isValid}, XP: ${xpAwarded}`);
    }
    catch (error) {
        console.error("Error validating project:", error);
        throw error;
    }
}
//# sourceMappingURL=projects.service.js.map