import { supabase } from "./supabase";
import type { Subcategory } from "../types/categories";

export class SubcategoriesService {
  
  /**
   * Ottiene tutte le subcategorie attive per una categoria specifica
   */
  static async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    try {
      console.log(`🔍 Caricamento subcategorie per categoria ${categoryId}...`);
      
      const { data, error } = await supabase
        .from('subcategories_with_category') // Usiamo la view creata nel database
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('❌ Errore nel caricamento subcategorie:', error);
        throw new Error(`Errore nel caricamento delle subcategorie: ${error.message}`);
      }

      console.log(`✅ Caricate ${data?.length || 0} subcategorie per categoria ${categoryId}`);
      return data || [];
    } catch (error) {
      console.error('❌ Errore nel service subcategorie:', error);
      throw error;
    }
  }

  /**
   * Ottiene tutte le subcategorie attive con informazioni categoria
   */
  static async getAllActiveSubcategories(): Promise<Subcategory[]> {
    try {
      console.log('🔍 Caricamento di tutte le subcategorie attive...');
      
      const { data, error } = await supabase
        .from('subcategories_with_category')
        .select('*')
        .eq('is_active', true)
        .order('category_id, sort_order');

      if (error) {
        console.error('❌ Errore nel caricamento subcategorie:', error);
        throw new Error(`Errore nel caricamento delle subcategorie: ${error.message}`);
      }

      console.log(`✅ Caricate ${data?.length || 0} subcategorie totali`);
      return data || [];
    } catch (error) {
      console.error('❌ Errore nel service subcategorie:', error);
      throw error;
    }
  }

  /**
   * Ottiene una subcategoria specifica per ID
   */
  static async getSubcategoryById(subcategoryId: string): Promise<Subcategory | null> {
    try {
      console.log(`🔍 Caricamento subcategoria ${subcategoryId}...`);
      
      const { data, error } = await supabase
        .from('subcategories_with_category')
        .select('*')
        .eq('id', subcategoryId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`⚠️ Subcategoria ${subcategoryId} non trovata`);
          return null;
        }
        console.error('❌ Errore nel caricamento subcategoria:', error);
        throw new Error(`Errore nel caricamento della subcategoria: ${error.message}`);
      }

      console.log(`✅ Subcategoria ${subcategoryId} caricata con successo`);
      return data;
    } catch (error) {
      console.error('❌ Errore nel service subcategoria:', error);
      throw error;
    }
  }

  /**
   * Ottiene subcategorie per livello di difficoltà
   */
  static async getSubcategoriesByDifficulty(
    categoryId: number, 
    difficultyLevel: number
  ): Promise<Subcategory[]> {
    try {
      console.log(`🔍 Caricamento subcategorie categoria ${categoryId} con difficoltà ${difficultyLevel}...`);
      
      const { data, error } = await supabase
        .from('subcategories_with_category')
        .select('*')
        .eq('category_id', categoryId)
        .eq('difficulty_level', difficultyLevel)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('❌ Errore nel caricamento subcategorie per difficoltà:', error);
        throw new Error(`Errore nel caricamento delle subcategorie: ${error.message}`);
      }

      console.log(`✅ Caricate ${data?.length || 0} subcategorie difficoltà ${difficultyLevel}`);
      return data || [];
    } catch (error) {
      console.error('❌ Errore nel service subcategorie difficoltà:', error);
      throw error;
    }
  }

  /**
   * Ricerca subcategorie per termine
   */
  static async searchSubcategories(
    searchTerm: string, 
    categoryId?: number
  ): Promise<Subcategory[]> {
    try {
      console.log(`🔍 Ricerca subcategorie: "${searchTerm}"${categoryId ? ` in categoria ${categoryId}` : ''}...`);
      
      let query = supabase
        .from('subcategories_with_category')
        .select('*')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // Ricerca in nome e descrizione (italiano)
      query = query.or(`name_it.ilike.%${searchTerm}%,description_it.ilike.%${searchTerm}%`);
      
      query = query.order('category_id, sort_order');

      const { data, error } = await query;

      if (error) {
        console.error('❌ Errore nella ricerca subcategorie:', error);
        throw new Error(`Errore nella ricerca delle subcategorie: ${error.message}`);
      }

      console.log(`✅ Trovate ${data?.length || 0} subcategorie per "${searchTerm}"`);
      return data || [];
    } catch (error) {
      console.error('❌ Errore nel service ricerca subcategorie:', error);
      throw error;
    }
  }

  /**
   * Ottiene statistiche delle subcategorie per categoria
   */
  static async getSubcategoriesStats(): Promise<{
    category_name: string;
    subcategory_count: number;
  }[]> {
    try {
      console.log('📊 Caricamento statistiche subcategorie...');
      
      const { data, error } = await supabase
        .rpc('count_subcategories_by_category'); // Funzione creata nel database

      if (error) {
        console.error('❌ Errore nel caricamento statistiche:', error);
        throw new Error(`Errore nel caricamento delle statistiche: ${error.message}`);
      }

      console.log(`✅ Statistiche caricate: ${data?.length || 0} categorie`);
      return data || [];
    } catch (error) {
      console.error('❌ Errore nel service statistiche:', error);
      throw error;
    }
  }
}
