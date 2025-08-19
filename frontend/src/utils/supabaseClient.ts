import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';


if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with anon key for regular operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
