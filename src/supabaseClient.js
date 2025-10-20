import { createClient } from '@supabase/supabase-js';

// Prefer env vars; fall back to hardcoded values provided by the user to avoid runtime crash
const envUrl = process.env.REACT_APP_SUPABASE_URL;
const envKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const fallbackUrl = 'https://iyjvblxyefhbnzounucv.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5anZibHh5ZWZoYm56b3VudWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTYzMzAsImV4cCI6MjA3NjQ3MjMzMH0.yoGkt2QmiufbRHkAJ7cqgrQOOqX8c--7faaCdicc8Gk';

const supabaseUrl = envUrl || fallbackUrl;
const supabaseAnonKey = envKey || fallbackKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpful for UI/tests to know whether env vars were detected or fallback is used
export const supabaseConfigInfo = {
  source: envUrl && envKey ? 'env' : 'fallback',
  urlInUse: supabaseUrl
};

export default supabase;
