/**
 * TEMPORANEO: Bypass email confirmation per testing
 * DA RIMUOVERE IN PRODUZIONE!
 */
import { supabase } from "../services/supabase";

export class BypassEmailConfirmation {
  /**
   * SOLO PER TESTING: Registra utente senza conferma email
   */
  static async signUpWithoutEmailConfirmation(email: string, password: string) {
    try {
      console.log("🚧 TESTING MODE: SignUp without email confirmation");

      // Prima tenta registrazione normale
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Questo potrebbe non funzionare se Supabase richiede conferma
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error("❌ SignUp error:", error);
        return { error, data: null };
      }

      console.log("📝 SignUp response:", data);

      if (data.user && !data.session) {
        console.log("⚠️ User created but needs email confirmation");
        console.log(`🆔 User ID: ${data.user.id}`);
        console.log("💡 In produzione, l'utente dovrebbe confermare via email");

        // In development, potresti voler confermare manualmente l'utente
        // Questo richiede admin privileges che non abbiamo dal client
        return {
          error: null,
          data,
          message:
            "User created but needs email confirmation. Check your email.",
        };
      }

      return { error: null, data };
    } catch (error) {
      console.error("❌ Bypass signup error:", error);
      return { error, data: null };
    }
  }

  /**
   * Controlla se possiamo fare login diretto (per testing)
   */
  static async attemptDirectLogin(email: string, password: string) {
    try {
      console.log("🚧 TESTING: Attempting direct login");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Direct login failed:", error);
        if (
          error.message.includes("email") ||
          error.message.includes("confirm")
        ) {
          console.log("💡 This confirms the email confirmation is required");
        }
        return { error, data: null };
      }

      console.log("✅ Direct login successful:", data);
      return { error: null, data };
    } catch (error) {
      console.error("❌ Direct login error:", error);
      return { error, data: null };
    }
  }
}

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).BypassEmailConfirmation = BypassEmailConfirmation;
  console.log("🚧 BypassEmailConfirmation available (TESTING ONLY!)");
  console.log(
    "Try: BypassEmailConfirmation.attemptDirectLogin('email', 'password')"
  );
}
