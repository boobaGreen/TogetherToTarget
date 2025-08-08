import { supabase } from "./supabase";

/**
 * Versione semplificata per test del recupero profilo
 */
export class SimpleProfileService {
  static async getSimpleProfile(userId: string) {
    try {
      console.log("🔍 [SIMPLE] Recupero profilo per:", userId);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("📋 [SIMPLE] Profilo non trovato");
          return null;
        }
        console.error("❌ [SIMPLE] Errore:", error);
        return null;
      }

      console.log("✅ [SIMPLE] Profilo trovato:", data);
      return data;
    } catch (error) {
      console.error("❌ [SIMPLE] Errore catch:", error);
      return null;
    }
  }
}
