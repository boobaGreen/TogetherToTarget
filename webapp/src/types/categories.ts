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

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect: (category: Category) => void;
  loading?: boolean;
}
