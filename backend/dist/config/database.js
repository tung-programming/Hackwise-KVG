"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
// Supabase client setup
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
const globalForSupabase = globalThis;
exports.supabase = globalForSupabase.supabase ??
    (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
if (process.env.NODE_ENV !== "production")
    globalForSupabase.supabase = exports.supabase;
exports.default = exports.supabase;
//# sourceMappingURL=database.js.map