import { supabase } from "./supabase";
import type { Category } from "../types/categories";

export class CategoriesService {
  /**
   * Recupera tutte le categorie attive dal database
   */
  static async getActiveCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Errore nel recupero delle categorie:", error);
        throw new Error("Impossibile recuperare le categorie");
      }

      return data || [];
    } catch (error) {
      console.error("Errore nel servizio categorie:", error);
      throw error;
    }
  }

  /**
   * Recupera una categoria specifica per ID
   */
  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Categoria non trovata
        }
        console.error("Errore nel recupero della categoria:", error);
        throw new Error("Impossibile recuperare la categoria");
      }

      return data;
    } catch (error) {
      console.error("Errore nel servizio categoria:", error);
      throw error;
    }
  }

  /**
   * Cerca categorie per nome (utile per future funzionalità di ricerca)
   */
  static async searchCategories(searchTerm: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .or(
          `name_it.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,description_it.ilike.%${searchTerm}%`
        )
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Errore nella ricerca delle categorie:", error);
        throw new Error("Impossibile cercare le categorie");
      }

      return data || [];
    } catch (error) {
      console.error("Errore nella ricerca categorie:", error);
      throw error;
    }
  }
}
