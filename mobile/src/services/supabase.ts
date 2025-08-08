import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";

// Configurazione Supabase (stesse credenziali della webapp)
const supabaseUrl = "https://rqooyyyrmqyvpzvkwqrn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb295eXlybXF5dnB6dmt3cXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTUwNjgsImV4cCI6MjA3MDIzMTA2OH0.1CzC_rGvrOCspxme06y1AGcBbZFZTLLiZCYheXhcr5Y";

// Configurazione client Supabase per React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types (stessi della webapp)
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

export interface User {
  id: string;
  email: string;
  created_at: string;
  // Aggiungi altri campi utente secondo il tuo schema
}
