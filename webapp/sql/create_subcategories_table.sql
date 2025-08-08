-- CREAZIONE TABELLA SUBCATEGORIE
-- 77 subcategorie validate scientificamente per TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Crea la tabella subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_it text NOT NULL,
  name_en text NOT NULL,
  description_it text,
  description_en text,
  emoji text,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_days integer DEFAULT 30 CHECK (estimated_duration_days > 0),
  group_size_optimal integer DEFAULT 3 CHECK (group_size_optimal BETWEEN 2 AND 5),
  psychological_benefits text[], -- Array di benefici psicologici
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  validation_source text, -- Note sulla validazione scientifica
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint per evitare duplicati
  UNIQUE(category_id, name_it),
  UNIQUE(category_id, name_en)
);

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- 3. Policy: tutti possono leggere le subcategorie attive
CREATE POLICY "Anyone can view active subcategories" ON subcategories
  FOR SELECT USING (is_active = true);

-- 4. Policy: solo admin possono modificare (per ora)
CREATE POLICY "Only admins can modify subcategories" ON subcategories
  FOR ALL USING (false); -- Disabilitato per sicurezza

-- 5. Trigger per aggiornare updated_at automaticamente
CREATE TRIGGER update_subcategories_updated_at 
  BEFORE UPDATE ON subcategories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Indici per performance
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_active ON subcategories(is_active);
CREATE INDEX idx_subcategories_difficulty ON subcategories(difficulty_level);
CREATE INDEX idx_subcategories_sort_order ON subcategories(category_id, sort_order);

-- 7. Commenti per documentazione
COMMENT ON TABLE subcategories IS 'Subcategorie validate scientificamente per obiettivi TogetherToTarget';
COMMENT ON COLUMN subcategories.difficulty_level IS 'Difficoltà da 1 (facile) a 5 (impegnativo)';
COMMENT ON COLUMN subcategories.estimated_duration_days IS 'Durata stimata in giorni (default 30)';
COMMENT ON COLUMN subcategories.group_size_optimal IS 'Dimensione ottimale del gruppo (default 3)';
COMMENT ON COLUMN subcategories.psychological_benefits IS 'Array di benefici psicologici identificati';
COMMENT ON COLUMN subcategories.validation_source IS 'Fonte della validazione scientifica';

-- 8. View per facilità di consultazione
CREATE OR REPLACE VIEW subcategories_with_category AS
SELECT 
  s.*,
  c.name_it as category_name_it,
  c.name_en as category_name_en,
  c.emoji as category_emoji,
  c.color as category_color
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE s.is_active = true AND c.is_active = true
ORDER BY c.sort_order, s.sort_order;

-- 9. Funzione helper per contare subcategorie per categoria
CREATE OR REPLACE FUNCTION count_subcategories_by_category()
RETURNS TABLE(
  category_name text,
  subcategory_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name_it,
    COUNT(s.id)
  FROM categories c
  LEFT JOIN subcategories s ON c.id = s.category_id AND s.is_active = true
  WHERE c.is_active = true
  GROUP BY c.id, c.name_it, c.sort_order
  ORDER BY c.sort_order;
END;
$$ LANGUAGE plpgsql;

-- 10. Verifica struttura
SELECT 'Tabella subcategories creata con successo!' as status;
