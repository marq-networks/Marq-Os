import { createClient } from '@supabase/supabase-js';
import { getConfig } from '../config';

export function getSupabaseAdmin() {
  const cfg = getConfig();
  const url = cfg.supabaseUrl;
  const serviceKey = cfg.supabaseServiceRoleKey;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (required when using Supabase)');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

