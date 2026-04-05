// Projects service
import { randomUUID } from "crypto";
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

    const status = !project.is_validated
      ? "pending"
      : project.is_completed
      ? "validated"
      : "failed";

    return {
      status,
      result:
        project.is_validated && project.validation_feedback
          ? {
              isValid: project.is_completed,
              score: project.is_completed ? 80 : 40,
              feedback: project.validation_feedback
                .split("\n")
                .map((line: string) => line.trim())
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
async function validateProjectAsync(userId: string, projectId: string, project: any) {
  try {
    const { data: existingProject, error: existingProjectError } = await supabase
      .from("projects")
      .select("is_completed, xp_awarded, completed_at")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (existingProjectError || !existingProject) {
      throw existingProjectError || new Error("Project not found during validation");
    }

    const alreadyRewarded =
      !!existingProject.is_completed && (existingProject.xp_awarded || 0) > 0;

    const validation = await validateProjectWithAI({
      title: project.name,
      description: project.description,
      repoUrl: project.submission_url,
      liveUrl: null,
      technologies: [],
    });

    const isValid = validation.isValid && validation.score >= 60;
    const calculatedXp = XP_BY_DIFFICULTY[project.difficulty] || 250;
    const xpAwarded = isValid
      ? alreadyRewarded
        ? existingProject.xp_awarded || calculatedXp
        : calculatedXp
      : 0;
    const now = new Date().toISOString();

    // Update project with validation result
    await supabase
      .from("projects")
      .update({
        is_validated: true,
        is_completed: isValid || !!existingProject.is_completed,
        completed_at: isValid ? existingProject.completed_at || now : null,
        validation_feedback: validation.feedback.join("\n") + "\n\nSuggestions:\n" + validation.suggestions.join("\n"),
        xp_awarded: xpAwarded,
        updated_at: now,
      })
      .eq("id", projectId);

    if (isValid) {
      if (!alreadyRewarded) {
        await awardProjectXPAndRefreshLeaderboard(userId, xpAwarded);

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
      }

      // Ensure leaderboard table is always synced with current user XP.
      await syncLeaderboardFromUsersTable(userId);

      // If all projects for this interest are completed, close the interest.
      const { data: allProjects } = await supabase
        .from("projects")
        .select("is_completed")
        .eq("interest_id", project.interest_id);

      const allProjectsCompleted = allProjects?.every((p) => p.is_completed) || false;
      if (allProjectsCompleted) {
        await supabase
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
  } catch (error) {
    console.error("Error validating project:", error);
    throw error;
  }
}

async function awardProjectXPAndRefreshLeaderboard(userId: string, xpAwarded: number) {
  const now = new Date().toISOString();

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, username, field, type, xp")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw userError || new Error("User not found while awarding XP");
  }

  const updatedXp = (user.xp || 0) + xpAwarded;

  const { error: updateUserError } = await supabase
    .from("users")
    .update({ xp: updatedXp, updated_at: now })
    .eq("id", userId);

  if (updateUserError) throw updateUserError;

  await upsertLeaderboardRow({
    userId,
    username: user.username || "Anonymous",
    field: user.field || "unspecified",
    type: user.type || "unspecified",
    totalXp: updatedXp,
  });

  await recalculateLeaderboardRanks();
}

async function syncLeaderboardFromUsersTable(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, field, type, xp")
    .eq("id", userId)
    .single();

  if (error || !user) {
    throw error || new Error("User not found while syncing leaderboard");
  }

  await upsertLeaderboardRow({
    userId: user.id,
    username: user.username || "Anonymous",
    field: user.field || "unspecified",
    type: user.type || "unspecified",
    totalXp: user.xp || 0,
  });

  await recalculateLeaderboardRanks();
}

async function upsertLeaderboardRow(input: {
  userId: string;
  username: string;
  field: string;
  type: string;
  totalXp: number;
}) {
  const now = new Date().toISOString();

  const { data: existingRow } = await supabase
    .from("leaderboard")
    .select("id")
    .eq("user_id", input.userId)
    .maybeSingle();

  if (existingRow?.id) {
    const { error: updateLeaderboardError } = await supabase
      .from("leaderboard")
      .update({
        username: input.username,
        total_xp: input.totalXp,
        field: input.field,
        type: input.type,
        updated_at: now,
      })
      .eq("id", existingRow.id);

    if (updateLeaderboardError) throw updateLeaderboardError;
    return;
  }

  const { error: insertLeaderboardError } = await supabase.from("leaderboard").insert({
    id: randomUUID(),
    user_id: input.userId,
    username: input.username,
    total_xp: input.totalXp,
    rank: 0,
    field: input.field,
    type: input.type,
    updated_at: now,
  });

  if (insertLeaderboardError) throw insertLeaderboardError;
}

async function recalculateLeaderboardRanks() {
  const { data: leaderboardEntries, error: leaderboardError } = await supabase
    .from("leaderboard")
    .select("id, user_id, total_xp, updated_at")
    .order("total_xp", { ascending: false })
    .order("updated_at", { ascending: true });

  if (leaderboardError) throw leaderboardError;

  const entries = leaderboardEntries || [];

  await Promise.all(
    entries.map((entry, index) =>
      supabase
        .from("leaderboard")
        .update({ rank: index + 1, updated_at: new Date().toISOString() })
        .eq("id", entry.id)
    )
  );

  await Promise.all(
    entries.map((entry, index) =>
      supabase
        .from("users")
        .update({ leaderboard_pos: index + 1 })
        .eq("id", entry.user_id)
    )
  );
}
