import { supabase } from "./supabase";
import type { GoalInputData } from "../types/goal";
import type { ExperienceLevelData } from "../types/experience";
import type { AvailabilityData } from "../types/availability";

export interface MatchingPreferences {
  motivation?: string;
  meeting_frequency: string;
  notes?: string;
}

export interface CategoryInfo {
  id: number;
  name_it: string;
  name_en: string;
  emoji: string;
  color: string;
}

export interface UserProfile {
  id: string; // UUID from auth.users
  category_id: number;
  goal_description: string;
  goal_deadline?: Date;
  experience_level: "beginner" | "intermediate" | "advanced";
  preferred_meeting_times: string[];
  timezone: string;
  availability_hours: string;
  matching_preferences: MatchingPreferences;
  is_available_for_matching: boolean;
  created_at: string;
  updated_at: string;
  categories?: CategoryInfo; // Opzionale, popolato con join
}

export interface CreateUserProfileData {
  categoryId: number;
  goalData: GoalInputData;
  experienceData: ExperienceLevelData;
  availabilityData: AvailabilityData;
}

export class UserProfilesService {
  /**
   * Crea o aggiorna un profilo utente completo
   */
  static async createOrUpdateProfile(
    userId: string,
    profileData: CreateUserProfileData
  ): Promise<UserProfile> {
    try {
      console.log("🚀 Inizio salvataggio profilo per utente:", userId);
      console.log("📋 Dati da salvare:", profileData);

      const { categoryId, goalData, experienceData, availabilityData } =
        profileData;

      // Prepara i dati per il database
      const dbData = {
        id: userId,
        category_id: categoryId,
        goal_description: goalData.description,
        goal_deadline: goalData.deadline || null,
        experience_level: experienceData.level,
        preferred_meeting_times: availabilityData.preferredDays.map((day) =>
          day.toString()
        ),
        timezone: availabilityData.timezone,
        availability_hours: availabilityData.availabilityHours,
        matching_preferences: {
          motivation: experienceData.motivation,
          meeting_frequency: availabilityData.meetingFrequency,
          notes: availabilityData.notes || null,
        },
        is_available_for_matching: true,
        updated_at: new Date().toISOString(),
      };

      console.log("💾 Dati preparati per DB:", dbData);

      console.log("💾 Dati preparati per DB:", dbData);

      // Usa upsert per creare o aggiornare
      console.log("📤 Esecuzione upsert su user_profiles...");
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(dbData, {
          onConflict: "id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Errore Supabase:", error);
        throw new Error(`Impossibile salvare il profilo: ${error.message}`);
      }

      console.log("✅ Profilo salvato con successo:", data);

      // IMPORTANTE: Aggiorna anche il campo onboarding_completed nella tabella users
      console.log(
        "📝 Aggiornamento campo onboarding_completed per utente:",
        userId
      );
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", userId);

      if (userUpdateError) {
        console.error(
          "⚠️ Errore nell'aggiornamento users.onboarding_completed:",
          userUpdateError
        );
        // Non lanciamo errore perché il profilo è stato salvato correttamente
        // L'onboarding sarà considerato completato dalla presenza del profilo
      } else {
        console.log(
          "✅ Campo onboarding_completed aggiornato nella tabella users"
        );
      }

      return data;
    } catch (error) {
      console.error("Errore nel servizio profilo:", error);
      throw error;
    }
  }

  /**
   * Recupera il profilo utente esistente
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log("🔍 Recupero profilo per utente:", userId);

      // Prima proviamo senza JOIN per debug
      const { data: simpleData, error: simpleError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (simpleError) {
        if (simpleError.code === "PGRST116") {
          console.log(
            "📋 Profilo non trovato per utente (simple query):",
            userId
          );
          return null;
        }
        console.error("❌ Errore nella query semplice:", simpleError);
      } else {
        console.log("✅ Profilo trovato (simple query):", simpleData);
      }

      // Ora proviamo con JOIN
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          *,
          categories(id, name_it, name_en, emoji, color)
        `
        )
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("📋 Profilo non trovato per utente:", userId);
          return null; // Profilo non trovato
        }
        console.error("❌ Errore nel recupero del profilo con JOIN:", error);
        console.log("🔄 Fallback: uso dati semplici senza category info");

        // Fallback: ritorna i dati semplici se il JOIN fallisce
        if (simpleData) {
          return simpleData as UserProfile;
        }

        throw new Error(`Impossibile recuperare il profilo: ${error.message}`);
      }

      console.log("✅ Profilo recuperato con categoria:", data);
      return data;
    } catch (error) {
      console.error("Errore nel servizio profilo:", error);
      throw error;
    }
  }

  /**
   * Controlla se l'utente ha già completato l'onboarding
   */
  static async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile !== null;
    } catch (error) {
      console.error("Errore nel controllo onboarding:", error);
      return false;
    }
  }

  /**
   * Aggiorna la disponibilità per il matching
   */
  static async updateMatchingAvailability(
    userId: string,
    isAvailable: boolean
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          is_available_for_matching: isAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Errore nell'aggiornamento disponibilità:", error);
        throw new Error(
          `Impossibile aggiornare la disponibilità: ${error.message}`
        );
      }
    } catch (error) {
      console.error("Errore nel servizio disponibilità:", error);
      throw error;
    }
  }

  /**
   * Elimina il profilo utente (per ricominciare l'onboarding)
   */
  static async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Errore nell'eliminazione del profilo:", error);
        throw new Error(`Impossibile eliminare il profilo: ${error.message}`);
      }
    } catch (error) {
      console.error("Errore nel servizio eliminazione:", error);
      throw error;
    }
  }

  /**
   * Ottieni statistiche sui profili per categoria
   */
  static async getProfileStats(): Promise<
    Record<
      number,
      {
        category: { name_it: string; name_en: string };
        total: number;
        byLevel: { beginner: number; intermediate: number; advanced: number };
      }
    >
  > {
    try {
      const { data, error } = await supabase.from("user_profiles").select(`
          category_id,
          experience_level,
          categories(name_it, name_en)
        `);

      if (error) {
        console.error("Errore nel recupero statistiche:", error);
        throw new Error(
          `Impossibile recuperare le statistiche: ${error.message}`
        );
      }

      // Raggruppa per categoria e livello
      const stats: Record<
        number,
        {
          category: { name_it: string; name_en: string };
          total: number;
          byLevel: { beginner: number; intermediate: number; advanced: number };
        }
      > = {};

      data.forEach((profile) => {
        const categoryId = profile.category_id;
        const experienceLevel = profile.experience_level as
          | "beginner"
          | "intermediate"
          | "advanced";

        if (!stats[categoryId]) {
          stats[categoryId] = {
            category: profile.categories[0], // Prendi il primo elemento dell'array
            total: 0,
            byLevel: { beginner: 0, intermediate: 0, advanced: 0 },
          };
        }
        stats[categoryId].total += 1;
        stats[categoryId].byLevel[experienceLevel] += 1;
      });

      return stats;
    } catch (error) {
      console.error("Errore nel servizio statistiche:", error);
      throw error;
    }
  }
}
