import { supabase } from "./supabase";

export class DatabaseTest {
  /**
   * Testa la connessione al database e verifica le tabelle
   */
  static async testConnection(): Promise<void> {
    try {
      console.log("🔍 Test connessione database...");

      // Test 1: Verifica connessione di base
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("❌ Errore autenticazione:", authError);
        return;
      }
      console.log("✅ Utente autenticato:", auth.user?.email);

      // Test 2: Verifica tabella categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name_it")
        .limit(3);

      if (categoriesError) {
        console.error("❌ Errore categories:", categoriesError);
      } else {
        console.log(
          "✅ Tabella categories accessibile:",
          categories.length,
          "record"
        );
      }

      // Test 3: Verifica tabella user_profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id")
        .limit(1);

      if (profilesError) {
        console.error("❌ Errore user_profiles:", profilesError);
        console.log(
          "💡 Probabilmente la tabella non esiste ancora. Eseguire lo script SQL."
        );
      } else {
        console.log(
          "✅ Tabella user_profiles accessibile:",
          profiles.length,
          "record"
        );
      }

      // Test 4: Verifica struttura user_profiles
      const { error: schemaError } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(0);

      if (schemaError) {
        console.error("❌ Schema user_profiles non accessibile:", schemaError);
      } else {
        console.log("✅ Schema user_profiles verificato");
      }
    } catch (error) {
      console.error("❌ Errore generale nel test database:", error);
    }
  }

  /**
   * Testa l'inserimento di un profilo di prova (solo per debug)
   */
  static async testProfileInsert(userId: string): Promise<void> {
    try {
      console.log("🧪 Test inserimento profilo di prova...");

      const testData = {
        id: userId,
        category_id: 1, // Assumendo che esista
        goal_description: "Test goal",
        experience_level: "beginner" as const,
        preferred_meeting_times: ["monday", "tuesday"],
        timezone: "Europe/Rome",
        availability_hours: "flexible",
        matching_preferences: { test: true },
        is_available_for_matching: true,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(testData, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("❌ Errore test insert:", error);
      } else {
        console.log("✅ Test insert riuscito:", data);

        // Cleanup: rimuovi il record di test
        await supabase
          .from("user_profiles")
          .delete()
          .eq("id", userId)
          .eq("goal_description", "Test goal");

        console.log("🧹 Record di test rimosso");
      }
    } catch (error) {
      console.error("❌ Errore nel test insert:", error);
    }
  }
}
