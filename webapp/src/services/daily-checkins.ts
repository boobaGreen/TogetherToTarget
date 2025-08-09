// Daily Check-in Service per TogetherToTarget
import { supabase } from "./supabase";

// Tipi per il sistema di check-in
export interface CheckinTemplate {
  id: number;
  subcategory_name: string;
  category_id: number;
  form_schema: {
    [fieldName: string]: {
      type: "text" | "number" | "boolean" | "select" | "scale";
      label: string;
      placeholder?: string;
      options?: string[];
      min?: number;
      max?: number;
      step?: number;
      required: boolean;
    };
  };
  display_order: number;
  is_active: boolean;
}

export interface DailyCheckin {
  id: number;
  user_id: string;
  group_id?: number;
  user_profile_id: string;
  category_id: number;
  subcategory_name: string;
  target_date: string; // YYYY-MM-DD
  submitted_at: string;
  grace_period_ends_at: string;
  responses: Record<string, unknown>;
  shared_with_group: boolean;
  notes?: string;
  completion_status: "completed" | "partial" | "missed" | "auto_closed";
  streak_day: number;
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: number;
  user_id: string;
  category_id: number;
  subcategory_name: string;
  current_streak: number;
  longest_streak: number;
  last_checkin_date?: string;
  total_checkins: number;
  total_missed: number;
}

export interface CheckinReminder {
  id: number;
  user_id: string;
  target_date: string;
  reminder_type: "24h_before" | "12h_before" | "custom";
  scheduled_at: string;
  sent_at?: string;
  email_sent: boolean;
  status: "scheduled" | "sent" | "cancelled";
}

class DailyCheckinService {
  // 1. Ottieni template form per una sottocategoria
  async getCheckinTemplate(
    subcategoryName: string
  ): Promise<CheckinTemplate | null> {
    const { data, error } = await supabase
      .from("checkin_form_templates")
      .select("*")
      .eq("subcategory_name", subcategoryName)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Errore nel recuperare template:", error);
      // Fallback a template generico
      return this.getCheckinTemplate("general");
    }

    return data;
  }

  // 2. Ottieni tutti i template disponibili
  async getAllTemplates(): Promise<CheckinTemplate[]> {
    const { data, error } = await supabase
      .from("checkin_form_templates")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error("Errore nel recuperare template:", error);
      return [];
    }

    return data || [];
  }

  // 3. Crea/aggiorna check-in
  async submitCheckin(checkinData: {
    category_id: number;
    subcategory_name: string;
    target_date: string; // YYYY-MM-DD
    responses: Record<string, unknown>;
    notes?: string;
    shared_with_group?: boolean;
  }): Promise<DailyCheckin | null> {
    // Calcola grace period (72 ore dopo target_date)
    const targetDate = new Date(checkinData.target_date);
    const gracePeriodEnd = new Date(targetDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 1); // Giorno dopo
    gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 72); // + 72 ore

    // Ottieni user profile per group_id
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("id, group_id")
      .eq("category_id", checkinData.category_id)
      .single();

    const checkinPayload = {
      category_id: checkinData.category_id,
      subcategory_name: checkinData.subcategory_name,
      target_date: checkinData.target_date,
      grace_period_ends_at: gracePeriodEnd.toISOString(),
      responses: checkinData.responses,
      notes: checkinData.notes || null,
      shared_with_group: checkinData.shared_with_group ?? true,
      group_id: userProfile?.group_id || null,
      user_profile_id: userProfile?.id || null,
    };

    // Upsert: aggiorna se esiste per quella data, altrimenti crea
    const { data, error } = await supabase
      .from("daily_checkins")
      .upsert(checkinPayload, {
        onConflict: "user_id,target_date,category_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Errore nel salvare check-in:", error);
      throw new Error("Impossibile salvare il check-in");
    }

    return data;
  }

  // 4. Ottieni check-in per data
  async getCheckinForDate(
    categoryId: number,
    targetDate: string
  ): Promise<DailyCheckin | null> {
    const { data, error } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("category_id", categoryId)
      .eq("target_date", targetDate)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows
      console.error("Errore nel recuperare check-in:", error);
    }

    return data || null;
  }

  // 5. Ottieni check-in recenti (ultima settimana)
  async getRecentCheckins(
    categoryId: number,
    days: number = 7
  ): Promise<DailyCheckin[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("category_id", categoryId)
      .gte("target_date", startDate.toISOString().split("T")[0])
      .lte("target_date", endDate.toISOString().split("T")[0])
      .order("target_date", { ascending: false });

    if (error) {
      console.error("Errore nel recuperare check-in recenti:", error);
      return [];
    }

    return data || [];
  }

  // 6. Ottieni streak dell'utente
  async getUserStreak(
    categoryId: number,
    subcategoryName: string
  ): Promise<UserStreak | null> {
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("category_id", categoryId)
      .eq("subcategory_name", subcategoryName)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Errore nel recuperare streak:", error);
    }

    return data || null;
  }

  // 7. Ottieni tutti gli streak dell'utente
  async getAllUserStreaks(): Promise<UserStreak[]> {
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .order("current_streak", { ascending: false });

    if (error) {
      console.error("Errore nel recuperare streak:", error);
      return [];
    }

    return data || [];
  }

  // 8. Ottieni check-in condivisi del gruppo
  async getGroupCheckins(
    groupId: number,
    days: number = 7
  ): Promise<DailyCheckin[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("daily_checkins")
      .select(
        `
        *,
        user_profiles!inner(
          id,
          display_name,
          avatar_url
        )
      `
      )
      .eq("group_id", groupId)
      .eq("shared_with_group", true)
      .gte("target_date", startDate.toISOString().split("T")[0])
      .lte("target_date", endDate.toISOString().split("T")[0])
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Errore nel recuperare check-in gruppo:", error);
      return [];
    }

    return data || [];
  }

  // 9. Verifica se può ancora fare check-in (dentro grace period)
  async canStillCheckin(
    categoryId: number,
    targetDate: string
  ): Promise<boolean> {
    const existing = await this.getCheckinForDate(categoryId, targetDate);

    if (existing) {
      // Già fatto, può ancora modificare se dentro grace period
      const gracePeriodEnd = new Date(existing.grace_period_ends_at);
      return new Date() <= gracePeriodEnd;
    }

    // Non ancora fatto, può fare se non è troppo tardi
    const targetDateObj = new Date(targetDate);
    const maxAllowed = new Date(targetDateObj);
    maxAllowed.setDate(maxAllowed.getDate() + 4); // 3 giorni + 1

    return new Date() <= maxAllowed;
  }

  // 10. Ottieni statistiche check-in per dashboard
  async getCheckinStats(
    categoryId: number,
    days: number = 30
  ): Promise<{
    total_checkins: number;
    completion_rate: number;
    current_streak: number;
    best_streak: number;
    consistency_score: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Ottieni check-in del periodo
    const checkins = await this.getRecentCheckins(categoryId, days);

    // Ottieni streak info
    const { data: streakData } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak")
      .eq("category_id", categoryId)
      .order("current_streak", { ascending: false })
      .limit(1)
      .single();

    const totalCheckins = checkins.filter(
      (c) => c.completion_status === "completed"
    ).length;
    const totalPossibleDays = days;
    const completionRate =
      totalPossibleDays > 0 ? (totalCheckins / totalPossibleDays) * 100 : 0;

    // Consistency score: % giorni con check-in negli ultimi 7 giorni
    const recentCheckins = checkins.filter((c) => {
      const checkinDate = new Date(c.target_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return checkinDate >= weekAgo && c.completion_status === "completed";
    });
    const consistencyScore = (recentCheckins.length / 7) * 100;

    return {
      total_checkins: totalCheckins,
      completion_rate: Math.round(completionRate),
      current_streak: streakData?.current_streak || 0,
      best_streak: streakData?.longest_streak || 0,
      consistency_score: Math.round(consistencyScore),
    };
  }

  // 11. Programma reminder per check-in
  async scheduleReminder(
    targetDate: string,
    reminderType: "24h_before" | "12h_before" | "custom" = "24h_before"
  ): Promise<boolean> {
    const targetDateObj = new Date(targetDate);
    let scheduledAt: Date;

    switch (reminderType) {
      case "24h_before":
        scheduledAt = new Date(targetDateObj);
        scheduledAt.setDate(scheduledAt.getDate() - 1);
        scheduledAt.setHours(20, 0, 0, 0); // 20:00 giorno prima
        break;
      case "12h_before":
        scheduledAt = new Date(targetDateObj);
        scheduledAt.setHours(12, 0, 0, 0); // 12:00 stesso giorno
        break;
      default:
        return false;
    }

    const { error } = await supabase.from("checkin_reminders").insert({
      target_date: targetDate,
      reminder_type: reminderType,
      scheduled_at: scheduledAt.toISOString(),
      status: "scheduled",
    });

    if (error) {
      console.error("Errore nel programmare reminder:", error);
      return false;
    }

    return true;
  }
}

// Export singleton
export const dailyCheckinService = new DailyCheckinService();
