-- SCRIPT DI TEST MINIMO - SOLO PRIMA CATEGORIA
-- Eseguire questo PRIMA nel SQL Editor di Supabase per testare

-- 1. Crea la tabella subcategories 
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_it text NOT NULL,
  name_en text NOT NULL,
  description_it text,
  description_en text,
  emoji text,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration_days integer DEFAULT 30 CHECK (estimated_duration_days > 0),
  group_size_optimal integer DEFAULT 3 CHECK (group_size_optimal BETWEEN 2 AND 5),
  psychological_benefits text[],
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  validation_source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category_id, name_it),
  UNIQUE(category_id, name_en)
);

-- 2. Abilita RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- 3. Policy di lettura
CREATE POLICY "Anyone can view active subcategories" ON subcategories
  FOR SELECT USING (is_active = true);

-- 4. Crea la view
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

-- 5. Inserisci SOLO 3 subcategorie di test per "Salute e Fitness"
INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  'Camminata quotidiana',
  'Daily Walking', 
  'Almeno 30 minuti di camminata al giorno',
  'At least 30 minutes of daily walking',
  '🚶‍♀️',
  1,
  30,
  ARRAY['Endorfine', 'Riduzione stress', 'Miglioramento umore'],
  'Validato: app fitness + Google Trends + psicologia esercizio',
  1
FROM categories c
WHERE c.name_it = 'Salute e Fitness'
AND c.is_active = true;

INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  'Yoga mattutino',
  'Morning Yoga', 
  '15-30 minuti di yoga ogni mattina',
  '15-30 minutes of yoga every morning',
  '🧘‍♀️',
  2,
  30,
  ARRAY['Mindfulness', 'Flessibilità mentale', 'Riduzione ansia'],
  'Validato: app wellness + trends + ricerca mindfulness',
  2
FROM categories c
WHERE c.name_it = 'Salute e Fitness'
AND c.is_active = true;

INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  'Sonno ottimizzato',
  'Optimized Sleep', 
  '7-8 ore di sonno di qualità ogni notte',
  '7-8 hours of quality sleep every night',
  '😴',
  2,
  30,
  ARRAY['Regolazione emotiva', 'Memoria', 'Benessere generale'],
  'Validato: app sleep + trends + ricerca sonno',
  3
FROM categories c
WHERE c.name_it = 'Salute e Fitness'
AND c.is_active = true;

-- 6. TEST FINALE - Verifica che tutto funzioni
SELECT 
  'TEST COMPLETATO!' as status,
  COUNT(*) as subcategorie_inserite
FROM subcategories;

-- 7. Verifica la view
SELECT 
  s.name_it,
  s.emoji,
  s.difficulty_level,
  s.category_name_it,
  s.category_emoji
FROM subcategories_with_category s
LIMIT 5;
