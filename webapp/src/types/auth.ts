// Types per l'autenticazione e il database
export interface User {
  id: string;
  email: string;
  name?: string;
  language: "it" | "en";
  timezone?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
  language?: "it" | "en";
}
