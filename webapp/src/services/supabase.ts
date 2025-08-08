import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Category {
  id: number;
  name_it: string;
  name_en: string;
  description_it?: string;
  description_en?: string;
  emoji?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
