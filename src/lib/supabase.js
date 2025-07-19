import { createClient } from '@supabase/supabase-js';

// On lit d'abord les variables NEXT_PUBLIC_ (prod Vercel)
// puis on retombe sur VITE_ (dev local) si elles n'existent pas
const supabaseUrl =
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
