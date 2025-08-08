-- Tabella categories per TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase SOLO se non esiste già

-- 1. Crea la tabella categories (se non esiste)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_it VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  description_it TEXT,
  description_en TEXT,
  emoji VARCHAR(10),
  color VARCHAR(7) DEFAULT '#667eea',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Abilita RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Policy: tutti possono leggere le categorie attive
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- 4. Trigger per updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Inserisci le 7 categorie consolidate per MVP
INSERT INTO categories (name_it, name_en, description_it, description_en, emoji, color, sort_order) VALUES
  ('Salute e Fitness', 'Health & Fitness', 'Benessere fisico, sport, alimentazione, salute mentale', 'Physical wellness, sports, nutrition, mental health', '🏃', '#FF6B6B', 1),
  ('Studio e Competenze', 'Study & Skills', 'Lingue, certificazioni, corsi, formazione', 'Languages, certifications, courses, training', '📚', '#4ECDC4', 2),
  ('Creatività e Hobby', 'Creativity & Hobbies', 'Arte, musica, scrittura, progetti creativi', 'Art, music, writing, creative projects', '🎨', '#45B7D1', 3),
  ('Produttività e Organizzazione', 'Productivity & Organization', 'Gestione tempo, routine, abitudini, efficienza', 'Time management, routines, habits, efficiency', '⚡', '#96CEB4', 4),
  ('Mindfulness e Crescita', 'Mindfulness & Growth', 'Meditazione, sviluppo personale, benessere mentale', 'Meditation, personal development, mental wellness', '🧘', '#FFEAA7', 5),
  ('Carriera e Sviluppo', 'Career & Development', 'Sviluppo professionale, networking, leadership', 'Professional development, networking, leadership', '🚀', '#DDA0DD', 6),
  ('Lifestyle e Relazioni', 'Lifestyle & Relationships', 'Finanze, sostenibilità, relazioni, famiglia', 'Finance, sustainability, relationships, family', '🌱', '#98D8C8', 7)
ON CONFLICT DO NOTHING;

-- 6. Commenti per documentazione
COMMENT ON TABLE categories IS 'Categorie di obiettivi per il matching degli utenti - 7 categorie MVP consolidate';
COMMENT ON COLUMN categories.name_it IS 'Nome categoria in italiano';
COMMENT ON COLUMN categories.name_en IS 'Nome categoria in inglese';
COMMENT ON COLUMN categories.emoji IS 'Emoji rappresentativa della categoria';
COMMENT ON COLUMN categories.color IS 'Colore hex per UI (#RRGGBB)';
COMMENT ON COLUMN categories.sort_order IS 'Ordine di visualizzazione nelle liste';
