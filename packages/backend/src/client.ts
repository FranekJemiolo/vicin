import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseClient(
  supabaseUrl?: string,
  supabaseKey?: string
): SupabaseClient | null {
  const url = supabaseUrl || process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    supabaseKey || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
