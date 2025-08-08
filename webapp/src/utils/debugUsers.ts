import { supabase } from "../services/supabase";

/**
 * Debug utility per controllare utenti creati
 */
export class DebugUsers {
  /**
   * Lista tutti gli utenti in auth.users (solo admin)
   */
  static async listAuthUsers() {
    try {
      console.log("🔍 Checking auth users...");

      // Questo non funzionerà da client (serve admin)
      // Ma possiamo controllare l'utente corrente
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("❌ Error getting current user:", error);
        return;
      }

      console.log("👤 Current user:", user);
      return user;
    } catch (error) {
      console.error("❌ Error in listAuthUsers:", error);
    }
  }

  /**
   * Controlla utenti nella tabella users custom
   */
  static async listCustomUsers() {
    try {
      console.log("🔍 Checking custom users table...");

      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .limit(10);

      if (error) {
        console.error("❌ Error getting users from custom table:", error);
        console.log(
          "💡 This might mean the users table doesn't exist or RLS is blocking"
        );
        return;
      }

      console.log("👥 Users in custom table:", users);
      return users;
    } catch (error) {
      console.error("❌ Error in listCustomUsers:", error);
    }
  }

  /**
   * Test completo registrazione
   */
  static async testRegistration(email: string, password: string) {
    try {
      console.log(`🧪 Testing registration for: ${email}`);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("❌ Registration error:", error);
        return { success: false, error };
      }

      console.log("✅ Registration response:", data);

      if (data.user && !data.session) {
        console.log("📧 User created, waiting for email confirmation");
        console.log(`🆔 User ID: ${data.user.id}`);
        console.log(`📧 Email: ${data.user.email}`);
        console.log(
          `🔍 Email confirmed: ${data.user.email_confirmed_at ? "Yes" : "No"}`
        );
      }

      return { success: true, data };
    } catch (error) {
      console.error("❌ Test registration error:", error);
      return { success: false, error };
    }
  }

  /**
   * Forza resend email di conferma
   */
  static async resendConfirmation(email: string) {
    try {
      console.log(`📧 Resending confirmation email to: ${email}`);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        console.error("❌ Resend error:", error);
        return false;
      }

      console.log("✅ Confirmation email resent");
      return true;
    } catch (error) {
      console.error("❌ Resend confirmation error:", error);
      return false;
    }
  }
}

// Esporta per uso nella console browser
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).DebugUsers = DebugUsers;
  console.log("🛠️ DebugUsers available in console. Try:");
  console.log("DebugUsers.listAuthUsers()");
  console.log("DebugUsers.listCustomUsers()");
  console.log("DebugUsers.resendConfirmation('your@email.com')");
}
