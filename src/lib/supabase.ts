import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function createSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) return null;

  return createClient(supabaseUrl, supabasePublishableKey);
}

export const supabase = createSupabaseClient();
export const isSupabaseConfigured = supabase !== null;
