-- Script per verificare stato attuale database e aggiungere solo quello che manca

-- 1. Verifica tabelle esistenti
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'user_profiles', 'groups', 'group_members', 'group_activities', 'matching_queue');

-- 2. Se categories esiste già, aggiorna solo i dati se necessario
INSERT INTO categories (name_it, name_en, description_it, description_en, emoji, color, sort_order) VALUES
  ('Fitness e Sport', 'Fitness & Sports', 'Allenamenti, sport, benessere fisico', 'Workouts, sports, physical wellness', '💪', '#FF6B6B', 1),
  ('Apprendimento', 'Learning', 'Studio, corsi, nuove competenze', 'Study, courses, new skills', '📚', '#4ECDC4', 2),
  ('Creatività', 'Creativity', 'Arte, musica, scrittura, progetti creativi', 'Art, music, writing, creative projects', '🎨', '#45B7D1', 3),
  ('Produttività', 'Productivity', 'Organizzazione, abitudini, efficienza', 'Organization, habits, efficiency', '⚡', '#96CEB4', 4),
  ('Benessere', 'Wellness', 'Meditazione, mindfulness, salute mentale', 'Meditation, mindfulness, mental health', '🧘', '#FFEAA7', 5),
  ('Carriera', 'Career', 'Sviluppo professionale, networking', 'Professional development, networking', '🚀', '#DDA0DD', 6),
  ('Relazioni', 'Relationships', 'Migliorare rapporti sociali e familiari', 'Improving social and family relationships', '❤️', '#FFB6C1', 7),
  ('Finanze', 'Finance', 'Risparmio, investimenti, gestione denaro', 'Saving, investments, money management', '💰', '#FD79A8', 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Se la tabella categories esiste ma è vuota o mancano colonne, aggiornala
-- (Esegui questo solo se necessario)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#667eea';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
