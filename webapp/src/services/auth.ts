import { supabase } from "./supabase";
import type { LoginCredentials, SignupCredentials, User } from "../types/auth";

export class AuthService {
  // Registrazione nuovo utente
  static async signUp({
    email,
    password,
    name,
    language = "en",
  }: SignupCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            language,
          },
        },
      });

      if (error) throw error;

      // Se la registrazione è riuscita, crea il profilo
      if (data.user) {
        await this.createProfile(data.user.id, {
          email,
          name,
          language,
        });
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Login utente esistente
  static async signIn({ email, password }: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Logout
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Ottieni sessione corrente
  static async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  }

  // Ottieni profilo utente dal database
  static async getProfile(
    userId: string
  ): Promise<{ profile: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error: any) {
      return { profile: null, error: error.message };
    }
  }

  // Crea profilo nel database
  static async createProfile(
    userId: string,
    profileData: {
      email: string;
      name?: string;
      language?: "it" | "en";
    }
  ) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            email: profileData.email,
            name: profileData.name,
            language: profileData.language || "en",
            onboarding_completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error: any) {
      return { profile: null, error: error.message };
    }
  }

  // Aggiorna profilo
  static async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error: any) {
      return { profile: null, error: error.message };
    }
  }

  // Listener per cambiamenti di stato auth
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
