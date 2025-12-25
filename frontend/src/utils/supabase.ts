// Supabase configuration and utilities for image handling

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./constants";



export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const supabaseConfig: SupabaseConfig = {
  url: SUPABASE_URL || '',
  anonKey: SUPABASE_ANON_KEY || '',
};
