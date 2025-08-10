import { supabase } from "./supabase";
import type {
  UserMatchingPreferences,
  WaitTimeEstimate,
  ObjectiveSuggestion,
  MatchingStatus,
} from "../types/matching";

export class MatchingService {
  // === GESTIONE PREFERENZE UTENTE ===

  /**
   * Recupera le preferenze di matching dell'utente
   */
  static async getUserPreferences(
    userId: string
  ): Promise<UserMatchingPreferences | null> {
    const { data, error } = await supabase
      .from("user_matching_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Errore nel recupero preferenze:", error);
      return null;
    }

    return data;
  }

  /**
   * Crea o aggiorna le preferenze di matching dell'utente
   */
  static async upsertUserPreferences(
    userId: string,
    preferences: Partial<
      Omit<
        UserMatchingPreferences,
        "id" | "user_id" | "created_at" | "updated_at"
      >
    >
  ): Promise<UserMatchingPreferences | null> {
    try {
      // Prima tenta di aggiornare
      const { data: updateData, error: updateError } = await supabase
        .from("user_matching_preferences")
        .update(preferences)
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) {
        // Se non esiste, crea nuovo record
        if (updateError.code === "PGRST116") {
          // No rows found, create new
          const { data: insertData, error: insertError } = await supabase
            .from("user_matching_preferences")
            .insert({
              user_id: userId,
              ...preferences,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Errore nella creazione preferenze:", insertError);
            return null;
          }

          return insertData;
        } else {
          console.error("Errore nell'aggiornamento preferenze:", updateError);
          return null;
        }
      }

      return updateData;
    } catch (error) {
      console.error("Errore nel servizio preferenze:", error);
      return null;
    }
  }

  // === GESTIONE MATCHING POOL ===

  /**
   * Inserisce l'utente nel pool di matching usando la funzione PostgreSQL
   */
  static async enterMatchingPool(
    userId: string,
    objective: string,
    category: string,
    subcategory?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc("enter_matching_pool", {
        p_user_id: userId,
        p_objective: objective,
        p_category: category,
        p_subcategory: subcategory || null,
      });

      if (error) {
        console.error("Errore nella chiamata enter_matching_pool:", error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error("Errore nella chiamata enter_matching_pool:", error);
      return null;
    }
  }

  /**
   * Rimuove l'utente dal pool di matching usando la funzione PostgreSQL
   */
  static async exitMatchingPool(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc("exit_matching_pool", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Errore nella chiamata exit_matching_pool:", error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error("Errore nella chiamata exit_matching_pool:", error);
      return false;
    }
  }

  /**
   * Ottiene lo status completo di matching dell'utente usando la funzione PostgreSQL
   */
  static async getUserMatchingStatus(userId: string): Promise<{
    in_pool: boolean;
    objective?: string;
    category?: string;
    subcategory?: string;
    current_level?: string;
    hours_in_pool?: number;
    escalation_count?: number;
    estimated_next_escalation_hours?: number;
  } | null> {
    try {
      const { data, error } = await supabase.rpc("get_user_matching_status", {
        p_user_id: userId,
      });

      if (error) {
        console.error("Errore nella chiamata get_user_matching_status:", error);
        return null;
      }

      if (!data || data.length === 0) {
        return {
          in_pool: false,
          objective: undefined,
          category: undefined,
          subcategory: undefined,
          current_level: undefined,
          hours_in_pool: 0,
          escalation_count: 0,
          estimated_next_escalation_hours: 0,
        };
      }

      // La funzione RPC restituisce un array con un oggetto
      const result = Array.isArray(data) ? data[0] : data;

      return {
        in_pool: result.in_pool,
        objective: result.objective,
        category: result.category,
        subcategory: result.subcategory,
        current_level: result.current_level,
        hours_in_pool: result.hours_in_pool,
        escalation_count: result.escalation_count,
        estimated_next_escalation_hours: result.estimated_next_escalation_hours,
      };
    } catch (error) {
      console.error("Errore nella chiamata get_user_matching_status:", error);
      return null;
    }
  }

  /**
   * Calcola lo status di matching dell'utente usando la funzione PostgreSQL
   */
  static async getMatchingStatus(userId: string): Promise<MatchingStatus> {
    const statusData = await this.getUserMatchingStatus(userId);

    if (!statusData || !statusData.in_pool) {
      return "not_searching";
    }

    const hoursInPool = statusData.hours_in_pool || 0;

    if (hoursInPool >= 72) {
      return "awaiting_choice";
    } else if (hoursInPool >= 48) {
      return "searching_acceptable";
    } else if (hoursInPool >= 24) {
      return "searching_good";
    } else {
      return "searching_perfect";
    }
  }

  // === ANALYTICS E STIME ===

  /**
   * Calcola i tempi di attesa stimati per una categoria/sottocategoria
   */
  static async getWaitTimeEstimates(
    category: string,
    subcategory?: string
  ): Promise<WaitTimeEstimate | null> {
    try {
      // Chiamata a edge function per calcolo analytics
      const { data, error } = await supabase.functions.invoke(
        "calculate-wait-times",
        {
          body: { category, subcategory },
        }
      );

      if (error) {
        console.error("Errore nel calcolo tempi di attesa:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Errore nella chiamata analytics:", error);
      return null;
    }
  }

  /**
   * Ottiene suggerimenti di obiettivi popolari
   */
  static async getObjectiveSuggestions(
    currentCategory: string,
    currentSubcategory?: string
  ): Promise<ObjectiveSuggestion[]> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-objective-suggestions",
        {
          body: {
            current_category: currentCategory,
            current_subcategory: currentSubcategory,
          },
        }
      );

      if (error) {
        console.error("Errore nel recupero suggerimenti:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Errore nella chiamata suggerimenti:", error);
      return [];
    }
  }

  /**
   * Ottiene le dimensioni delle code per categoria usando la view
   */
  static async getQueueSizes(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from("matching_pool_stats")
        .select("category, users_count");

      if (error) {
        console.error("Errore nel recupero dimensioni code:", error);
        return {};
      }

      // Aggrega per categoria
      const queueSizes: Record<string, number> = {};
      data.forEach((entry) => {
        queueSizes[entry.category] =
          (queueSizes[entry.category] || 0) + entry.users_count;
      });

      return queueSizes;
    } catch (error) {
      console.error("Errore nel recupero dimensioni code:", error);
      return {};
    }
  }

  // === AZIONI POST-72H ===

  /**
   * Continua l'attesa con priorità alta
   */
  static async continueWaiting(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("matching_pool")
      .update({ priority: 1 })
      .eq("user_id", userId);

    if (error) {
      console.error("Errore nell'aggiornamento priorità:", error);
      return false;
    }

    return true;
  }

  /**
   * Cambia obiettivo dell'utente nel pool
   */
  static async changeObjective(
    userId: string,
    newObjective: string,
    newCategory: string,
    newSubcategory?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("matching_pool")
      .update({
        objective: newObjective,
        category: newCategory,
        subcategory: newSubcategory,
        priority: 0, // Reset priorità
        entered_at: new Date().toISOString(), // Reset timer
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Errore nel cambio obiettivo:", error);
      return false;
    }

    return true;
  }

  // === REAL-TIME SUBSCRIPTIONS ===

  /**
   * Sottoscrizione per notifiche di match trovato
   */
  static subscribeToMatchNotifications(
    userId: string,
    onMatchFound: (groupId: string) => void
  ) {
    return supabase
      .channel(`matching-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_members",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Match trovato! L'utente è stato aggiunto a un gruppo
          onMatchFound(payload.new.group_id);
        }
      )
      .subscribe();
  }

  /**
   * Sottoscrizione per aggiornamenti dimensioni code
   */
  static subscribeToQueueUpdates(
    onQueueUpdate: (queueSizes: Record<string, number>) => void
  ) {
    return supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matching_pool",
        },
        async () => {
          // Ricalcola dimensioni code
          const queueSizes = await this.getQueueSizes();
          onQueueUpdate(queueSizes);
        }
      )
      .subscribe();
  }
}
