// src/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Never expose your service role key in client-side code!
// Use only the public anon key for frontend apps.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
