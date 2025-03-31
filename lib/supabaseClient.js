import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (typeof window !== 'undefined') {
  // On the client, attach supabase to the window object
  if (!window.supabase) {
    window.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  supabase = window.supabase;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

console.log("Supabase client initialized:", supabase);
export { supabase };
