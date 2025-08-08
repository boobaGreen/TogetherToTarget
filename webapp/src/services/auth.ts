import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

// Interfacce per le credenziali
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  language: string;
}

// Interfaccia per l'utente del database
export interface DBUser {
  id: string;
  email: string;
  name: string;
  language: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Risultato delle operazioni auth
export interface AuthResult {
  user: User | null;
  error: string | null;
}

export interface SignupResult extends AuthResult {
  needsEmailConfirmation?: boolean;
}

// Servizio di autenticazione completamente nuovo
export class AuthService {
  // Login con email e password
  static async signInWithPassword(
    credentials: LoginCredentials
  ): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch {
      return { user: null, error: "Errore durante il login" };
    }
  }

  // Login con Google
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/oauth-callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Errore durante l'accesso con Google" };
    }
  }

  // Registrazione
  static async signUp(credentials: SignupCredentials): Promise<SignupResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            language: credentials.language,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      console.log("SignUp response:", data); // Debug

      // Se l'utente non ha una sessione, significa che deve confermare l'email
      const needsEmailConfirmation = Boolean(data.user && !data.session);

      // Se l'utente è stato creato, proviamo a creare anche il record nella tabella users
      // TEMPORANEAMENTE DISABILITATO: RLS impedisce l'inserimento con ruolo anon
      // Il record dovrebbe essere creato automaticamente da un trigger PostgreSQL
      if (data.user) {
        console.log("✅ Utente creato in auth.users:", data.user.id);
        console.log(
          "Il record nella tabella users sarà creato automaticamente dopo la conferma email"
        );
        //
        // try {
        //   const { error: userError } = await supabase.from("users").insert({
        //     id: data.user.id,
        //     email: data.user.email!,
        //     name: credentials.name,
        //     language: credentials.language,
        //     avatar_url: null,
        //     onboarding_completed: false,
        //   });
        //
        //   if (userError) {
        //     console.error("Errore creazione record utente:", userError);
        //   } else {
        //     console.log("✅ Record utente creato con successo");
        //   }
        // } catch (insertError) {
        //   console.error("Errore nell'inserimento utente:", insertError);
        // }
      }

      return {
        user: data.user,
        error: null,
        needsEmailConfirmation,
      };
    } catch {
      return { user: null, error: "Errore durante la registrazione" };
    }
  }

  // Logout
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Errore durante il logout" };
    }
  }

  // Reset password - richiesta email di reset
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Errore durante l'invio dell'email di reset" };
    }
  }

  // Update password - imposta nuova password
  static async updatePassword(
    newPassword: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Errore durante l'aggiornamento della password" };
    }
  }

  // Ottieni utente corrente
  static async getCurrentUser(): Promise<{
    user: DBUser | null;
    error: string | null;
  }> {
    try {
      console.log("🔍 AuthService.getCurrentUser: Starting...");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("❌ Error getting auth user:", error.message);
        return { user: null, error: error.message };
      }

      if (!user) {
        console.log("📭 No auth user found");
        return { user: null, error: null };
      }

      console.log("✅ Auth user found:", user.email, "ID:", user.id);

      // Ottieni i dati dell'utente dal database
      console.log("🔍 Searching for user in database...");
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        // Se l'utente non esiste nella tabella users (es. primo login OAuth)
        if (userError.code === "PGRST116") {
          console.log(
            "🆕 Creazione automatica record utente per OAuth:",
            user.email
          );

          // Crea il record utente
          const newUser: Partial<DBUser> = {
            id: user.id,
            email: user.email!,
            name:
              user.user_metadata?.name ||
              user.user_metadata?.full_name ||
              user.email!.split("@")[0],
            language: "it", // Default italiano
            avatar_url: user.user_metadata?.avatar_url || null,
            onboarding_completed: false,
          };

          const { data: createdUser, error: createError } = await supabase
            .from("users")
            .insert(newUser)
            .select()
            .single();

          if (createError) {
            // Se l'errore è che l'utente esiste già, recuperalo
            if (createError.code === "23505") {
              console.log("🔄 Utente già esistente, recupero dal database...");
              const { data: existingUser, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

              if (fetchError) {
                console.error(
                  "❌ Errore nel recupero utente esistente:",
                  fetchError
                );
                return { user: null, error: fetchError.message };
              }

              console.log(
                "✅ Utente esistente recuperato:",
                existingUser.email
              );
              return { user: existingUser as DBUser, error: null };
            }

            console.error("❌ Errore nella creazione utente:", createError);
            return { user: null, error: createError.message };
          }

          console.log("✅ Utente creato automaticamente:", createdUser);
          return { user: createdUser as DBUser, error: null };
        }

        console.log("❌ Errore nella creazione utente:", userError.message);
        return { user: null, error: userError.message };
      }

      console.log("✅ Utente trovato nel database:", userData.email);
      return { user: userData as DBUser, error: null };
    } catch (catchError) {
      console.log("❌ Catch error in getCurrentUser:", catchError);
      return { user: null, error: "Errore nel recupero utente" };
    }
  }
}
