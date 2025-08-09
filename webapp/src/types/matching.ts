// Tipi TypeScript per il sistema di matching - TogetherToTarget

// Preferenze utente per matching
export interface UserMatchingPreferences {
  id: string;
  user_id: string;
  preferred_group_size: 2 | 3 | 0; // 0 = any
  flexible_on_size: boolean;
  videocall_languages: string[];
  flexible_on_language: boolean;
  timezone: string;
  timezone_flexibility: boolean;
  created_at: string;
  updated_at: string;
}

// Utente in pool di matching
export interface MatchingPoolEntry {
  id: string;
  user_id: string;
  objective: string;
  category: string;
  subcategory?: string;
  timezone: string;
  priority: 0 | 1; // 0=normal, 1=high
  entered_at: string;
  updated_at: string;
}

// Analytics per tempi di attesa
export interface MatchAnalytics {
  id: string;
  category: string;
  subcategory?: string;
  wait_time_hours: number;
  group_size: number;
  timezone_spread: number;
  language_compatibility: "perfect" | "partial" | "translated";
  matched_at: string;
}

// Coda email notifiche
export interface EmailQueueEntry {
  id: string;
  user_id: string;
  email_type: "weekly_recall" | "match_found" | "level_escalation";
  email_data: Record<string, unknown>;
  scheduled_for: string;
  sent_at?: string;
  created_at: string;
}

// Criteri di matching per livello
export interface MatchingCriteria {
  timeRange: string;
  required: string[];
  removed?: string[];
  flexible?: string[];
  group_size: "respect_preferences" | "include_flexible" | "any_compatible";
}

// Livelli di matching
export const MATCHING_LEVELS = {
  PERFECT: {
    timeRange: "0-24h",
    timezoneToleranceHours: 2,
    requireSubcategory: true,
    requireExactLanguages: true,
  },
  GOOD: {
    timeRange: "24h-48h",
    timezoneToleranceHours: 4,
    requireSubcategory: false,
    requireExactLanguages: true,
  },
  ACCEPTABLE: {
    timeRange: "48h-72h",
    timezoneToleranceHours: 8,
    requireSubcategory: false,
    requireExactLanguages: false,
    includeFlexibleLanguages: true,
  },
  FALLBACK: {
    timeRange: "72h+",
    userChoice: true,
  },
} as const;

// Opzioni post-72h
export interface FallbackOptions {
  continue_waiting: {
    action: "continue_waiting";
    description: "Ti mettiamo in priorità assoluta";
  };
  change_objective: {
    action: "change_objective";
    description: "Prova con un obiettivo più popolare";
  };
}

// Stime tempi di attesa
export interface WaitTimeEstimate {
  category: string;
  subcategory?: string;
  estimated_wait_hours: number;
  confidence: "HIGH" | "LOW";
  sample_size: number;
  display: string; // "~2 giorni"
  current_queue_size: number;
  success_rate?: number; // 0-1
}

// Dati per UI cambio obiettivo
export interface ObjectiveSuggestion {
  objective: string;
  category: string;
  subcategory?: string;
  wait_estimate: WaitTimeEstimate;
  similarity_score: number; // 0-1 rispetto all'obiettivo corrente
  popularity_rank: number; // 1-N, più basso = più popolare
}

// Status matching utente
export type MatchingStatus =
  | "not_searching"
  | "searching_perfect"
  | "searching_good"
  | "searching_acceptable"
  | "awaiting_choice"
  | "matched"
  | "paused";

// Configurazione admin (futuro)
export interface AdminMatchingConfig {
  timing: {
    perfect_match_hours: number;
    good_match_hours: number;
    acceptable_match_hours: number;
  };
  criteria_weights: {
    category_importance: number;
    subcategory_importance: number;
    language_importance: number;
    timezone_importance: number;
  };
  notifications: {
    weekly_recalls_enabled: boolean;
    escalation_notifications: boolean;
    email_frequency_days: number;
  };
}

// Constanti lingue supportate
export const SUPPORTED_LANGUAGES = [
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
] as const;

// Costanti timezone comuni
export const COMMON_TIMEZONES = [
  "Europe/Rome",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
] as const;
