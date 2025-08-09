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

// Matching Types
export interface UserMatchingPreferences {
  id: string;
  user_id: string;
  preferred_group_size: number;
  flexible_on_size: boolean;
  videocall_languages: string[];
  flexible_on_language: boolean;
  timezone: string;
  timezone_flexibility: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchingPoolEntry {
  id: string;
  user_id: string;
  objective: string;
  category: string;
  subcategory?: string;
  timezone: string;
  priority: number;
  entered_at: string;
  updated_at: string;
}
