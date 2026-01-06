import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// Client for verifying user tokens (uses anon key or service role)
export const supabaseClient = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

