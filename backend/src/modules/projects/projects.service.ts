// Projects service
import { supabase } from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import { validateProjectWithAI } from "./project.validator";

const XP_BY_DIFFICULTY: Record<string, number> = {
  easy: 100,
  medium: 250,
  hard: 500,
};

export const projectsService = {
  // Get all projects for user
  getUserProjects: async (userId: string) => {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return projects || [];
  },

  // Get single project
  getProject: async (userId: string, projectId: string) => {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error || !project) {
      throw new NotFoundError("Project not found");
    }

    return project;
  },

  // Submit project (URL + optional description)
  submitProject: async (userId: string, projectId: string, submissionUrl: string, submissionData?: any) => {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projectError || !project) {
      throw new NotFoundError("Project not found");
    }

    if (project.is_locked) {
      throw new Error("Project is locked. Complete all courses first.");
    }

    // Update with submission
    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update({
        submission_url: submissionUrl,
        submission_data: submissionData || {},
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (updateError) throw updateError;

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
  getValidation: async (userId: string, projectId: string) => {
    const { data: project, error } = await supabase
      .from("projects")
      .select("id, name, is_validated, is_completed, validation_feedback, xp_awarded")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error || !project) {
      throw new NotFoundError("Project not found");
    }

    return {
      project_id: project.id,
      name: project.name,
      is_validated: project.is_validated,
      is_completed: project.is_completed,
      feedback: project.validation_feedback,
      xp_awarded: project.xp_awarded,
    };
  },
};

// Background validation function
async function validateProjectAsync(userId: string, projectId: string, project: any) {
  try {
    const validation = await validateProjectWithAI({
      title: project.name,
      description: project.description,
      repoUrl: project.submission_url,
      liveUrl: null,
      technologies: [],
    });

    const isValid = validation.isValid && validation.score >= 60;
    const xpAwarded = isValid ? XP_BY_DIFFICULTY[project.difficulty] || 250 : 0;

    // Update project with validation result
    await supabase
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
      await supabase.rpc("increment_xp", { user_id: userId, xp_amount: xpAwarded });

      // Log activity
      await supabase.from("user_activity_log").upsert(
        {
          user_id: userId,
          activity_type: "project_submitted",
          activity_date: new Date().toISOString().split("T")[0],
          metadata: { project_id: projectId, xp_awarded: xpAwarded },
        },
        { onConflict: "user_id,activity_type,activity_date" }
      );

      // Update streak
      await supabase.rpc("update_user_streak", { p_user_id: userId });

      // Refresh leaderboard
      await supabase.rpc("refresh_leaderboard");
    }

    console.log(`✅ Project ${projectId} validated. Valid: ${isValid}, XP: ${xpAwarded}`);
  } catch (error) {
    console.error("Error validating project:", error);
    throw error;
  }
}
