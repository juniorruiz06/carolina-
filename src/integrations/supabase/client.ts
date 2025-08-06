import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wuvujpclxntcychezsry.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnVqcGNseG50Y3ljaGV6c3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzAxNjksImV4cCI6MjA3MDAwNjE2OX0.PYhRHrjBYbCZcuaBf4ogcQ8RAAxIEwSif3sHbmlUi2I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});