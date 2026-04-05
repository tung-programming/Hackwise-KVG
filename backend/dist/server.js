"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server entry point
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const PORT = parseInt(env_1.env.PORT, 10);
async function main() {
    try {
        // Test Supabase connection
        const { error } = await database_1.supabase.from("users").select("count").limit(1);
        if (error && error.code !== "PGRST116") {
            throw error;
        }
        console.log("✅ Supabase connected");
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${env_1.env.NODE_ENV}`);
        });
    }
    catch (error) {
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
//# sourceMappingURL=server.js.map