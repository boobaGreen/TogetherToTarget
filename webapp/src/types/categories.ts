export interface Category {
  id: number;
  name_it: string;
  name_en: string;
  description_it: string;
  description_en: string;
  emoji: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Subcategory {
  id: string; // UUID
  category_id: number; // INTEGER che fa riferimento a categories.id
  name_it: string;
  name_en: string;
  description_it: string;
  description_en: string;
  emoji: string;
  difficulty_level: number;
  estimated_duration_days: number;
  group_size_optimal: number;
  psychological_benefits: string[];
  validation_source: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Dati della categoria padre (da view)
  category_name_it?: string;
  category_name_en?: string;
  category_emoji?: string;
  category_color?: string;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect: (category: Category) => void;
  loading?: boolean;
}

export interface SubcategorySelectorProps {
  selectedCategory: Category;
  subcategories: Subcategory[];
  selectedSubcategoryId?: string;
  onSubcategorySelect: (subcategory: Subcategory) => void;
  loading?: boolean;
}
