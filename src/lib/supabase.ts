import { createClient } from '@supabase/supabase-js';

// Supabase Project configuration
// Note: Standard Supabase URL format trims any trailing `/rest/v1/` for client SDK initialization
export const SUPABASE_URL = 'https://uummitoubvpcrxvzhrum.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_LdItRyOqNQQeowvDEtU3QA_BPYlyJ7d';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
