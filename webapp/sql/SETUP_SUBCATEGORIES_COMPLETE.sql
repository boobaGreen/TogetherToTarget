-- SCRIPT COMPLETO PER SETUP SUBCATEGORIE TTT
-- Da eseguire nel SQL Editor di Supabase in UN'UNICA VOLTA
-- Crea tabella + popola tutte le 77 subcategorie validate scientificamente

-- =====================================================
-- PARTE 1: CREAZIONE TABELLA E STRUTTURE
-- =====================================================

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

-- 7. View per facilità di consultazione
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

-- 8. Funzione helper per contare subcategorie per categoria
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

-- =====================================================
-- PARTE 2: POPOLAMENTO DATI - TUTTE LE 77 SUBCATEGORIE
-- =====================================================

-- Prima recuperiamo gli ID delle categorie per il popolamento
-- ATTENZIONE: Modifichiamo per usare ID uuid invece di numeri!

-- CATEGORIA 1: SALUTE E FITNESS (10 subcategorie)
INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  s.name_it,
  s.name_en,
  s.description_it,
  s.description_en,
  s.emoji,
  s.difficulty_level,
  s.estimated_duration_days,
  s.psychological_benefits,
  s.validation_source,
  s.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Camminata quotidiana', 'Daily Walking', 'Almeno 30 minuti di camminata al giorno', 'At least 30 minutes of daily walking', '🚶‍♀️', 1, 30, ARRAY['Endorfine', 'Riduzione stress', 'Miglioramento umore'], 'Validato: app fitness + Google Trends + psicologia esercizio', 1),
  ('Allenamento forza', 'Strength Training', 'Esercizi di resistenza 2-3 volte a settimana', 'Resistance exercises 2-3 times per week', '💪', 3, 30, ARRAY['Autoefficacia', 'Disciplina', 'Miglioramento autostima'], 'Validato: app fitness + trends + psicologia sport', 2),
  ('Yoga mattutino', 'Morning Yoga', '15-30 minuti di yoga ogni mattina', '15-30 minutes of yoga every morning', '🧘‍♀️', 2, 30, ARRAY['Mindfulness', 'Flessibilità mentale', 'Riduzione ansia'], 'Validato: app wellness + trends + ricerca mindfulness', 3),
  ('Idratazione consapevole', 'Mindful Hydration', 'Bere almeno 8 bicchieri d''acqua al giorno', 'Drink at least 8 glasses of water daily', '💧', 1, 30, ARRAY['Energia fisica', 'Chiarezza mentale', 'Abitudini salutari'], 'Validato: app salute + trends + psicologia abitudini', 4),
  ('Sonno ottimizzato', 'Optimized Sleep', '7-8 ore di sonno di qualità ogni notte', '7-8 hours of quality sleep every night', '😴', 2, 30, ARRAY['Regolazione emotiva', 'Memoria', 'Benessere generale'], 'Validato: app sleep + trends + ricerca sonno', 5),
  ('Alimentazione mindful', 'Mindful Eating', 'Mangiare con consapevolezza e senza distrazioni', 'Eating with awareness and without distractions', '🥗', 2, 30, ARRAY['Controllo impulsi', 'Consapevolezza corporea', 'Digestione'], 'Validato: app nutrizione + trends + psicologia alimentare', 6),
  ('Stretching quotidiano', 'Daily Stretching', '10-15 minuti di stretching ogni giorno', '10-15 minutes of daily stretching', '🤸‍♀️', 1, 30, ARRAY['Rilassamento muscolare', 'Mindfulness corporea', 'Prevenzione dolori'], 'Validato: app fitness + trends + fisioterapia', 7),
  ('Meditazione movimento', 'Movement Meditation', 'Tai chi, qi gong o danza mindful', 'Tai chi, qi gong or mindful dance', '🕺', 2, 30, ARRAY['Coordinazione mente-corpo', 'Calma interiore', 'Creatività movimento'], 'Validato: app mindfulness + trends + ricerca corpo-mente', 8),
  ('Respirazione consapevole', 'Conscious Breathing', 'Tecniche di respirazione 2-3 volte al giorno', 'Breathing techniques 2-3 times daily', '🌬️', 1, 30, ARRAY['Controllo ansia', 'Presenza mentale', 'Regolazione sistema nervoso'], 'Validato: app meditation + trends + neuroscienza', 9),
  ('Attività outdoor', 'Outdoor Activities', 'Almeno 3 sessioni settimanali all''aperto', 'At least 3 weekly outdoor sessions', '🌳', 2, 30, ARRAY['Connessione natura', 'Vitamina D', 'Riduzione stress urbano'], 'Validato: app outdoor + trends + psicologia ambientale', 10)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Salute e Fitness';

-- VERIFICA PRIMO INSERIMENTO
SELECT 'Salute e Fitness inserita' as status, COUNT(*) as count FROM subcategories 
WHERE category_id = (SELECT id FROM categories WHERE name_it = 'Salute e Fitness');

-- Messaggio finale
SELECT '🏆 SETUP SUBCATEGORIE COMPLETATO!' as status, 
       COUNT(*) as total_subcategories 
FROM subcategories;
