// Supabase client setup
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

export const supabase =
  globalForSupabase.supabase ??
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase;

export default supabase;
