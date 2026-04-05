"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyService = void 0;
// History service
const database_1 = require("../../config/database");
const storage_1 = require("../../config/storage");
const history_parser_1 = require("./history.parser");
const recommender_1 = require("../interests/recommender"); // ✅ STATIC import - dynamic import was silently failing
const errors_1 = require("../../utils/errors");
const uuid_1 = require("uuid");
exports.historyService = {
    uploadHistory: async (userId, file) => {
        const fileId = (0, uuid_1.v4)();
        const fileExt = file.originalname.split(".").pop()?.toLowerCase() || "json";
        if (fileExt !== "json") {
            throw new errors_1.BadRequestError("Only JSON history files are supported for interest analysis.");
        }
        const filePath = `history/${userId}/${fileId}.${fileExt}`;
        const fileUrl = await storage_1.storage.uploadFile(filePath, file.buffer, file.mimetype);
        const { data: historyRecord, error } = await database_1.supabase
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
        if (error)
            throw error;
        // Fire-and-forget
        processHistoryAsync(historyRecord.id, userId, file).catch((err) => {
            console.error("History processing failed:", err);
            database_1.supabase
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
    getHistory: async (userId, page = 1, limit = 20) => {
        const offset = (page - 1) * limit;
        const { data: entries, error, count } = await database_1.supabase
            .from("browsing_history")
            .select("*", { count: "exact" })
            .eq("user_id", userId)
            .order("upload_date", { ascending: false })
            .range(offset, offset + limit - 1);
        if (error)
            throw error;
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
    getHistoryStatus: async (userId, historyId) => {
        const { data: record, error } = await database_1.supabase
            .from("browsing_history")
            .select("id, status, processed_at, file_name")
            .eq("id", historyId)
            .eq("user_id", userId)
            .single();
        if (error || !record)
            throw new errors_1.NotFoundError("History record not found");
        let interests = null;
        if (record.status === "completed") {
            const { data } = await database_1.supabase
                .from("interests")
                .select("*")
                .eq("user_id", userId)
                .eq("history_id", historyId)
                .order("rank", { ascending: true });
            interests = data;
        }
        return { ...record, interests };
    },
    deleteHistory: async (userId, historyId) => {
        const { data: record, error: fetchError } = await database_1.supabase
            .from("browsing_history")
            .select("file_url")
            .eq("id", historyId)
            .eq("user_id", userId)
            .single();
        if (fetchError || !record)
            throw new errors_1.NotFoundError("History record not found");
        if (record.file_url) {
            try {
                const path = record.file_url.split("/").slice(-3).join("/");
                await storage_1.storage.deleteFile(path);
            }
            catch (e) {
                console.error("Failed to delete file from storage:", e);
            }
        }
        const { error } = await database_1.supabase
            .from("browsing_history")
            .delete()
            .eq("id", historyId)
            .eq("user_id", userId);
        if (error)
            throw error;
        return { message: "History deleted successfully" };
    },
};
async function processHistoryAsync(historyId, userId, file) {
    try {
        // Mark as processing
        await database_1.supabase
            .from("browsing_history")
            .update({ status: "processing" })
            .eq("id", historyId);
        // Parse file
        const parsedData = await (0, history_parser_1.parseHistoryFile)(file);
        console.log(`📋 Parsed ${parsedData.length} history entries for user ${userId}`);
        // ✅ Store raw_data BEFORE generating interests so recommender
        //    can also read it from DB if needed (and it's available on retry)
        await database_1.supabase
            .from("browsing_history")
            .update({ raw_data: parsedData })
            .eq("id", historyId);
        // Get user context
        const { data: user } = await database_1.supabase
            .from("users")
            .select("field, type")
            .eq("id", userId)
            .single();
        if (!user?.field || !user?.type) {
            throw new Error("User field/type not found. Complete onboarding before uploading history.");
        }
        const field = user.field;
        const type = user.type;
        console.log(`🔍 Generating interests for field=${field} type=${type} entries=${parsedData.length}`);
        // ✅ Static import used - no more silent dynamic import failure
        const interests = await (0, recommender_1.generateInterestsFromHistory)(parsedData, field, type);
        console.log(`💡 Gemini returned ${interests.length} interests: ${interests.map(i => i.name).join(", ")}`);
        if (interests.length === 0) {
            throw new Error("Gemini returned no interests from uploaded history.");
        }
        let storedCount = 0;
        for (let i = 0; i < interests.length && i < 4; i++) {
            const interest = interests[i];
            const cleanName = String(interest.name || "").trim();
            if (!cleanName)
                continue;
            const { data: existing, error: existingError } = await database_1.supabase
                .from("interests")
                .select("id, status, is_completed")
                .eq("user_id", userId)
                .eq("name", cleanName)
                .maybeSingle();
            if (existingError) {
                console.error("Interest lookup failed:", existingError.message, { name: cleanName });
                continue;
            }
            if (existing?.id) {
                const nextStatus = existing.status === "accepted" || existing.is_completed
                    ? existing.status
                    : "pending";
                const { error: updateError } = await database_1.supabase
                    .from("interests")
                    .update({
                    history_id: historyId,
                    description: interest.description,
                    rank: i + 1,
                    status: nextStatus,
                    updated_at: new Date().toISOString(),
                })
                    .eq("id", existing.id)
                    .eq("user_id", userId);
                if (updateError) {
                    console.error("Interest update failed:", updateError.message, { name: cleanName });
                    continue;
                }
            }
            else {
                const { error: insertError } = await database_1.supabase.from("interests").insert({
                    user_id: userId,
                    history_id: historyId,
                    name: cleanName,
                    description: interest.description,
                    status: "pending",
                    rank: i + 1,
                });
                if (insertError) {
                    console.error("Interest insert failed:", insertError.message, { name: cleanName });
                    continue;
                }
            }
            storedCount++;
        }
        console.log(`✅ Stored ${storedCount} interests for user ${userId}`);
        // XP reward
        const { error: xpError } = await database_1.supabase.rpc("increment_xp", {
            user_id: userId,
            xp_amount: 25,
        });
        if (xpError)
            console.warn("XP increment skipped:", xpError.message);
        // Final status update
        await database_1.supabase
            .from("browsing_history")
            .update({
            status: "completed",
            processed_at: new Date().toISOString(),
            raw_data: {
                entries: parsedData,
                meta: {
                    interests_requested: Math.min(interests.length, 4),
                    interests_stored: storedCount,
                },
            },
        })
            .eq("id", historyId);
    }
    catch (error) {
        console.error("Error processing history:", error);
        await database_1.supabase
            .from("browsing_history")
            .update({ status: "failed" })
            .eq("id", historyId);
        throw error;
    }
}
//# sourceMappingURL=history.service.js.map