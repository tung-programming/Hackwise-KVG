// Interests service
import { supabase } from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import geminiPool from "../../config/gemini";

export const interestsService = {
  // Get all interests for a user
  getUserInterests: async (userId: string) => {
    const { data: interests, error } = await supabase
      .from("interests")
      .select("*")
      .eq("user_id", userId)
      .order("rank", { ascending: true });

    if (error) throw error;
    return interests || [];
  },

  // Get single interest with courses and projects
  getInterest: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .select("*")
      .eq("id", interestId)
      .eq("user_id", userId)
      .single();

    if (error || !interest) {
      throw new NotFoundError("Interest not found");
    }

    // Get associated courses
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("interest_id", interestId)
      .order("node_order", { ascending: true });

    // Get associated projects
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("interest_id", interestId);

    return {
      ...interest,
      courses: courses || [],
      projects: projects || [],
    };
  },

  // Accept an interest - triggers roadmap generation
  acceptInterest: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", interestId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !interest) {
      throw new NotFoundError("Interest not found");
    }

    // Fire-and-forget async roadmap generation
    generateRoadmapAsync(userId, interest).catch((err) => {
      console.error("Roadmap generation failed:", err);
    });

    return {
      interest,
      message: "Interest accepted. Roadmap generation started.",
    };
  },

  // Reject an interest
  rejectInterest: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", interestId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !interest) {
      throw new NotFoundError("Interest not found");
    }

    return interest;
  },

  // Get progress for an interest
  getProgress: async (userId: string, interestId: string) => {
    const { data: interest, error } = await supabase
      .from("interests")
      .select("id, name, progress_pct, is_completed")
      .eq("id", interestId)
      .eq("user_id", userId)
      .single();

    if (error || !interest) {
      throw new NotFoundError("Interest not found");
    }

    const { data: courses } = await supabase
      .from("courses")
      .select("id, name, is_completed, is_locked")
      .eq("interest_id", interestId)
      .order("node_order", { ascending: true });

    const { data: projects } = await supabase
      .from("projects")
      .select("id, name, is_completed, is_locked, is_validated")
      .eq("interest_id", interestId);

    const completedCourses = courses?.filter((c) => c.is_completed).length || 0;
    const totalCourses = courses?.length || 0;

    return {
      interest_id: interest.id,
      name: interest.name,
      progress_pct: interest.progress_pct,
      is_completed: interest.is_completed,
      courses: {
        completed: completedCourses,
        total: totalCourses,
        items: courses || [],
      },
      projects: {
        completed: projects?.filter((p) => p.is_completed).length || 0,
        total: projects?.length || 0,
        items: projects || [],
      },
    };
  },
};

// Background function to generate roadmap
async function generateRoadmapAsync(userId: string, interest: any) {
  try {
    // Get user's field and type for context
    const { data: user } = await supabase
      .from("users")
      .select("field, type")
      .eq("id", userId)
      .single();

    const prompt = `Create a learning roadmap for "${interest.name}" for a ${user?.field || "engineering"} ${user?.type || "cse"} student.

Generate a sequential learning path with 5-7 course nodes.

Return a JSON object:
{
  "courses": [
    {
      "name": "Course Name",
      "description": "What you'll learn",
      "resource_url": "Recommended resource URL or 'null'",
      "roadmap_data": {"duration": "2 hours", "difficulty": "beginner"}
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Build this to practice",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Make courses progressive (basics first, advanced last).
Include 2-3 project ideas.
Return ONLY valid JSON.`;

    const response = await geminiPool.generateWithFlash(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const roadmap = JSON.parse(cleaned);

    // Insert courses
    if (roadmap.courses && Array.isArray(roadmap.courses)) {
      for (let i = 0; i < roadmap.courses.length; i++) {
        const course = roadmap.courses[i];
        await supabase.from("courses").insert({
          interest_id: interest.id,
          user_id: userId,
          name: course.name,
          description: course.description,
          resource_url: course.resource_url === "null" ? null : course.resource_url,
          node_order: i + 1,
          is_locked: i !== 0, // First course unlocked
          roadmap_data: course.roadmap_data || {},
        });
      }
    }

    // Insert projects
    if (roadmap.projects && Array.isArray(roadmap.projects)) {
      for (const project of roadmap.projects) {
        await supabase.from("projects").insert({
          interest_id: interest.id,
          user_id: userId,
          name: project.name,
          description: project.description,
          difficulty: project.difficulty || "medium",
          is_locked: true, // Locked until all courses complete
        });
      }
    }

    console.log(`✅ Roadmap generated for interest: ${interest.name}`);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}
