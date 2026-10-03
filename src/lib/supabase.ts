import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Whether real Supabase credentials have been provided.
 * The rest of the app checks this flag and falls back to local demo data
 * so the project remains fully explorable before Supabase is configured.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Never throw at import time if env vars are missing.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
