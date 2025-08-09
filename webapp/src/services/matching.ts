import { supabase } from "./supabase";
import type {
  UserMatchingPreferences,
  MatchingPoolEntry,
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
    const { data, error } = await supabase
      .from("user_matching_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
      })
      .select()
      .single();

    if (error) {
      console.error("Errore nell'aggiornamento preferenze:", error);
      return null;
    }

    return data;
  }

  // === GESTIONE MATCHING POOL ===

  /**
   * Inserisce l'utente nel pool di matching
   */
  static async enterMatchingPool(
    userId: string,
    objective: string,
    category: string,
    subcategory?: string
  ): Promise<MatchingPoolEntry | null> {
    // Prima rileva il timezone dell'utente
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { data, error } = await supabase
      .from("matching_pool")
      .insert({
        user_id: userId,
        objective,
        category,
        subcategory,
        timezone,
      })
      .select()
      .single();

    if (error) {
      console.error("Errore nell'inserimento nel matching pool:", error);
      return null;
    }

    return data;
  }

  /**
   * Rimuove l'utente dal pool di matching
   */
  static async exitMatchingPool(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("matching_pool")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Errore nella rimozione dal matching pool:", error);
      return false;
    }

    return true;
  }

  /**
   * Controlla se l'utente è nel pool di matching
   */
  static async getUserMatchingStatus(
    userId: string
  ): Promise<MatchingPoolEntry | null> {
    const { data, error } = await supabase
      .from("matching_pool")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Errore nel controllo status matching:", error);
      return null;
    }

    return data;
  }

  /**
   * Calcola lo status di matching dell'utente
   */
  static async getMatchingStatus(userId: string): Promise<MatchingStatus> {
    const poolEntry = await this.getUserMatchingStatus(userId);

    if (!poolEntry) {
      return "not_searching";
    }

    const hoursInPool =
      (Date.now() - new Date(poolEntry.entered_at).getTime()) /
      (1000 * 60 * 60);

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
   * Ottiene le dimensioni delle code per categoria
   */
  static async getQueueSizes(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("matching_pool")
      .select("category")
      .order("category");

    if (error) {
      console.error("Errore nel recupero dimensioni code:", error);
      return {};
    }

    // Conta per categoria
    const queueSizes: Record<string, number> = {};
    data.forEach((entry) => {
      queueSizes[entry.category] = (queueSizes[entry.category] || 0) + 1;
    });

    return queueSizes;
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
