// History service
import { supabase } from "../../config/database";
import { storage } from "../../config/storage";
import { parseHistoryFile } from "./history.parser";
import { NotFoundError } from "../../utils/errors";
import { v4 as uuidv4 } from "uuid";

export const historyService = {
  // Upload and process browsing history file
  uploadHistory: async (userId: string, file: Express.Multer.File) => {
    const fileId = uuidv4();
    const fileExt = file.originalname.split(".").pop()?.toLowerCase() || "json";
    const filePath = `history/${userId}/${fileId}.${fileExt}`;

    // Upload file to Supabase Storage
    const fileUrl = await storage.uploadFile(filePath, file.buffer, file.mimetype);

    // Create browsing_history record with pending status
    const { data: historyRecord, error } = await supabase
      .from("browsing_history")
      .insert({
        user_id: userId,
        file_name: file.originalname,
        file_type: fileExt,
        file_url: fileUrl,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Return 202 and process in background
    // Fire-and-forget async processing
    processHistoryAsync(historyRecord.id, userId, file).catch((err) => {
      console.error("History processing failed:", err);
      // Update status to failed
      supabase
        .from("browsing_history")
        .update({ status: "failed" })
        .eq("id", historyRecord.id);
    });

    return {
      id: historyRecord.id,
      status: "pending",
      message: "History upload started. Poll /history/:id/status for updates.",
    };
  },

  getHistory: async (userId: string, page: number = 1, limit: number = 20) => {
    const offset = (page - 1) * limit;

    const { data: entries, error, count } = await supabase
      .from("browsing_history")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("upload_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      entries: entries || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  },

  getHistoryStatus: async (userId: string, historyId: string) => {
    const { data: record, error } = await supabase
      .from("browsing_history")
      .select("id, status, processed_at, file_name")
      .eq("id", historyId)
      .eq("user_id", userId)
      .single();

    if (error || !record) {
      throw new NotFoundError("History record not found");
    }

    // If completed, also return the interests generated
    let interests = null;
    if (record.status === "completed") {
      const { data } = await supabase
        .from("interests")
        .select("*")
        .eq("user_id", userId)
        .eq("history_id", historyId)
        .order("rank", { ascending: true });

      interests = data;
    }

    return {
      ...record,
      interests,
    };
  },

  deleteHistory: async (userId: string, historyId: string) => {
    const { data: record, error: fetchError } = await supabase
      .from("browsing_history")
      .select("file_url")
      .eq("id", historyId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !record) {
      throw new NotFoundError("History record not found");
    }

    // Delete from storage
    if (record.file_url) {
      try {
        const path = record.file_url.split("/").slice(-3).join("/");
        await storage.deleteFile(path);
      } catch (e) {
        console.error("Failed to delete file from storage:", e);
      }
    }

    // Delete database record (cascade deletes related interests)
    const { error } = await supabase
      .from("browsing_history")
      .delete()
      .eq("id", historyId)
      .eq("user_id", userId);

    if (error) throw error;

    return { message: "History deleted successfully" };
  },
};

// Background processing function
async function processHistoryAsync(
  historyId: string,
  userId: string,
  file: Express.Multer.File
) {
  try {
    // Update status to processing
    await supabase
      .from("browsing_history")
      .update({ status: "processing" })
      .eq("id", historyId);

    // Parse the file
    const parsedData = await parseHistoryFile(file);

    // Store raw data
    await supabase
      .from("browsing_history")
      .update({ raw_data: parsedData })
      .eq("id", historyId);

    // Import the recommender to generate interests
    const { generateInterestsFromHistory } = await import(
      "../interests/recommender"
    );

    // Get user's field and type for context
    const { data: user } = await supabase
      .from("users")
      .select("field, type")
      .eq("id", userId)
      .single();

    // Generate top 4 interests
    const interests = await generateInterestsFromHistory(
      parsedData,
      user?.field || "engineering",
      user?.type || "cse"
    );

    // Insert interests
    for (let i = 0; i < interests.length && i < 4; i++) {
      await supabase.from("interests").insert({
        user_id: userId,
        history_id: historyId,
        name: interests[i].name,
        description: interests[i].description,
        status: "pending",
        rank: i + 1,
      });
    }

    // Award XP for uploading history
    await supabase.rpc("increment_xp", { user_id: userId, xp_amount: 25 });

    // Update status to completed
    await supabase
      .from("browsing_history")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", historyId);
  } catch (error) {
    console.error("Error processing history:", error);
    await supabase
      .from("browsing_history")
      .update({ status: "failed" })
      .eq("id", historyId);
    throw error;
  }
}
