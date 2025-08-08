import type { Session } from "@supabase/supabase-js";

// Utente dal database
export interface User {
  id: string;
  email: string;
  name: string;
  language: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Credenziali di login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Credenziali di registrazione
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  language: string;
}

// Interfaccia del Context di autenticazione
export interface AuthContextType {
  // Stato
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  message: string | null;

  // Metodi
  login: (credentials: LoginCredentials) => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  signup: (
    credentials: SignupCredentials
  ) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<{ error: string | null }>;
  clearError: () => void;
  clearMessage: () => void;
}
