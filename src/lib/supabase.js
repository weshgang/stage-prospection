// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Paste the real strings here (do NOT commit secrets to a public repo)
const supabaseUrl = 'https://cvngcifhtqvhsiyokobu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bmdjaWZodHF2aHNpeW9rb2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODI0NjgsImV4cCI6MjA2ODM1ODQ2OH0.jBzKgHHqrjfh2Kf5n6c_1308yu4fWgWjy_e655kADVo'; // ← your real anon key

export const supabase = createClient(supabaseUrl, supabaseKey);