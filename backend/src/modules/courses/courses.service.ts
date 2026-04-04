// Courses service
import { supabase } from "../../config/database";
import { NotFoundError } from "../../utils/errors";

const XP_COURSE_COMPLETE = 50;
const XP_ALL_COURSES_BONUS = 200;

export const coursesService = {
  // Get all courses for an interest (roadmap)
  getCoursesByInterest: async (userId: string, interestId: string) => {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", userId)
      .eq("interest_id", interestId)
      .order("node_order", { ascending: true });

    if (error) throw error;
    return courses || [];
  },

  // Get single course
  getCourse: async (userId: string, courseId: string) => {
    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("user_id", userId)
      .single();

    if (error || !course) {
      throw new NotFoundError("Course not found");
    }

    return course;
  },

  // Mark course as completed
  completeCourse: async (userId: string, courseId: string) => {
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*, interests!inner(id, name)")
      .eq("id", courseId)
      .eq("user_id", userId)
      .single();

    if (courseError || !course) {
      throw new NotFoundError("Course not found");
    }

    if (course.is_locked) {
      throw new Error("Course is locked. Complete previous courses first.");
    }

    if (course.is_completed) {
      return { course, message: "Course already completed", xp_awarded: 0 };
    }

    // Mark course as completed
    const { data: updatedCourse, error: updateError } = await supabase
      .from("courses")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Unlock the next course in sequence
    const { data: nextCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("interest_id", course.interest_id)
      .eq("node_order", course.node_order + 1)
      .single();

    if (nextCourse) {
      await supabase
        .from("courses")
        .update({ is_locked: false, updated_at: new Date().toISOString() })
        .eq("id", nextCourse.id);
    }

    // Check if ALL courses for this interest are completed
    const { data: allCourses } = await supabase
      .from("courses")
      .select("is_completed")
      .eq("interest_id", course.interest_id);

    const allCompleted = allCourses?.every((c) => c.is_completed) || false;
    let totalXpAwarded = XP_COURSE_COMPLETE;

    if (allCompleted) {
      // Add bonus XP
      totalXpAwarded += XP_ALL_COURSES_BONUS;

      // Mark interest as completed
      await supabase
        .from("interests")
        .update({
          is_completed: true,
          progress_pct: 100,
          updated_at: new Date().toISOString(),
        })
        .eq("id", course.interest_id);

      // Unlock associated projects
      await supabase
        .from("projects")
        .update({ is_locked: false, updated_at: new Date().toISOString() })
        .eq("interest_id", course.interest_id);
    } else {
      // Update interest progress
      const completedCount = allCourses?.filter((c) => c.is_completed).length || 0;
      const totalCount = allCourses?.length || 1;
      const progressPct = Math.round((completedCount / totalCount) * 100);

      await supabase
        .from("interests")
        .update({ progress_pct: progressPct, updated_at: new Date().toISOString() })
        .eq("id", course.interest_id);
    }

    // Award XP to user
    await supabase.rpc("increment_xp", { user_id: userId, xp_amount: totalXpAwarded });

    // Log activity for streak
    await supabase.from("user_activity_log").upsert(
      {
        user_id: userId,
        activity_type: "course_completed",
        activity_date: new Date().toISOString().split("T")[0],
        metadata: { course_id: courseId, course_name: course.name },
      },
      { onConflict: "user_id,activity_type,activity_date" }
    );

    // Update streak
    await supabase.rpc("update_user_streak", { p_user_id: userId });

    return {
      course: updatedCourse,
      xp_awarded: totalXpAwarded,
      all_courses_completed: allCompleted,
      message: allCompleted
        ? "All courses completed! Projects unlocked."
        : "Course completed!",
    };
  },
};
