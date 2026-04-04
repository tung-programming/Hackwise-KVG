// Server entry point
import app from "./app";
import { env } from "./config/env";
import { supabase } from "./config/database";

const PORT = parseInt(env.PORT, 10);

async function main() {
  try {
    // Test Supabase connection
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error && error.code !== "PGRST116") {
      throw error;
    }
    console.log("✅ Supabase connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("👋 Shutting down gracefully...");
  process.exit(0);
});
