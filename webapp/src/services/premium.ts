import { supabase } from "./supabase";

export interface UserLimits {
  is_premium: boolean;
  active_profiles: number;
  max_profiles: number;
  can_add_goal: boolean;
}

export interface PremiumStatus {
  is_premium: boolean;
  subscription_type: "free" | "premium_monthly" | "premium_yearly";
  premium_expires_at?: string;
  expires_in_days?: number;
}

export class PremiumService {
  /**
   * Ottieni i limiti dell'utente corrente
   */
  static async getUserLimits(userId: string): Promise<UserLimits> {
    try {
      // Invece di chiamare una RPC che potrebbe non esistere,
      // recuperiamo direttamente dalla tabella users
      const { data, error } = await supabase
        .from("users")
        .select("is_premium, subscription_type")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Errore nel recupero limiti utente:", error);
        // Fallback a limiti free
        return {
          is_premium: false,
          active_profiles: 0,
          max_profiles: 1,
          can_add_goal: true,
        };
      }

      // Logica semplificata per i limiti
      const isPremium = data.is_premium || false;

      return {
        is_premium: isPremium,
        active_profiles: 1, // Assumiamo sempre 1 attivo per ora
        max_profiles: isPremium ? 3 : 1,
        can_add_goal: true, // Sempre true per ora, da implementare logica complessa dopo
      };
    } catch (error) {
      console.error("Errore nel servizio limiti:", error);
      return {
        is_premium: false,
        active_profiles: 0,
        max_profiles: 1,
        can_add_goal: true,
      };
    }
  }

  /**
   * Ottieni status Premium dell'utente
   */
  static async getPremiumStatus(userId: string): Promise<PremiumStatus> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("is_premium, subscription_type, premium_expires_at")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Errore nel recupero status Premium:", error);
        return {
          is_premium: false,
          subscription_type: "free",
        };
      }

      const result: PremiumStatus = {
        is_premium: data.is_premium || false,
        subscription_type: data.subscription_type || "free",
        premium_expires_at: data.premium_expires_at,
      };

      // Calcola giorni rimanenti se Premium
      if (result.is_premium && result.premium_expires_at) {
        const expiresAt = new Date(result.premium_expires_at);
        const now = new Date();
        const diffTime = expiresAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        result.expires_in_days = Math.max(0, diffDays);
      }

      return result;
    } catch (error) {
      console.error("Errore nel servizio Premium status:", error);
      return {
        is_premium: false,
        subscription_type: "free",
      };
    }
  }

  /**
   * Attiva Premium per testing (da rimuovere in produzione)
   */
  static async activateTestPremium(
    userId: string,
    durationDays: number = 30
  ): Promise<boolean> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const { error } = await supabase
        .from("users")
        .update({
          is_premium: true,
          subscription_type: "premium_monthly",
          premium_expires_at: expiresAt.toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Errore nell'attivazione Premium test:", error);
        return false;
      }

      console.log(`✅ Premium test attivato per ${durationDays} giorni`);
      return true;
    } catch (error) {
      console.error("Errore nel servizio Premium test:", error);
      return false;
    }
  }

  /**
   * Disattiva Premium (per testing)
   */
  static async deactivatePremium(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          is_premium: false,
          subscription_type: "free",
          premium_expires_at: null,
        })
        .eq("id", userId);

      if (error) {
        console.error("Errore nella disattivazione Premium:", error);
        return false;
      }

      console.log("✅ Premium disattivato");
      return true;
    } catch (error) {
      console.error("Errore nel servizio Premium deactivate:", error);
      return false;
    }
  }

  /**
   * Controlla se l'utente può aggiungere un nuovo obiettivo
   */
  static async canAddGoal(
    userId: string
  ): Promise<{ canAdd: boolean; reason?: string }> {
    try {
      const limits = await this.getUserLimits(userId);

      if (limits.can_add_goal) {
        return { canAdd: true };
      }

      const reason = limits.is_premium
        ? "Hai raggiunto il limite di 3 obiettivi Premium"
        : "Upgrade a Premium per gestire fino a 3 obiettivi contemporanei";

      return { canAdd: false, reason };
    } catch (error) {
      console.error("Errore nel controllo aggiunta goal:", error);
      return { canAdd: false, reason: "Errore nel controllo limiti" };
    }
  }

  /**
   * Ottieni informazioni sui benefici Premium
   */
  static getPremiumFeatures() {
    return {
      free: {
        max_goals: 1,
        features: [
          "Un obiettivo alla volta",
          "Gruppo di supporto base",
          "Badge standard",
          "Storico completo (incluso)",
        ],
      },
      premium: {
        max_goals: 3,
        features: [
          "Fino a 3 obiettivi contemporanei",
          "Mantieni i tuoi gruppi preferiti",
          "Statistiche avanzate e insights",
          "Badge esclusivi e riconoscimenti",
          "Supporto umano prioritario (72h)",
          "Storico completo (incluso)",
        ],
      },
    };
  }
}

export default PremiumService;
