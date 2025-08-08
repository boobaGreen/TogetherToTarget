-- Script per verificare stato attuale database e aggiungere solo quello che manca

-- 1. Verifica tabelle esistenti
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'user_profiles', 'groups', 'group_members', 'group_activities', 'matching_queue');

-- 2. Aggiorna con le 7 categorie consolidate per MVP
INSERT INTO categories (name_it, name_en, description_it, description_en, emoji, color, sort_order) VALUES
  ('Salute e Fitness', 'Health & Fitness', 'Benessere fisico, sport, alimentazione, salute mentale', 'Physical wellness, sports, nutrition, mental health', '🏃', '#FF6B6B', 1),
  ('Studio e Competenze', 'Study & Skills', 'Lingue, certificazioni, corsi, formazione', 'Languages, certifications, courses, training', '📚', '#4ECDC4', 2),
  ('Creatività e Hobby', 'Creativity & Hobbies', 'Arte, musica, scrittura, progetti creativi', 'Art, music, writing, creative projects', '🎨', '#45B7D1', 3),
  ('Produttività e Organizzazione', 'Productivity & Organization', 'Gestione tempo, routine, abitudini, efficienza', 'Time management, routines, habits, efficiency', '⚡', '#96CEB4', 4),
  ('Mindfulness e Crescita', 'Mindfulness & Growth', 'Meditazione, sviluppo personale, benessere mentale', 'Meditation, personal development, mental wellness', '🧘', '#FFEAA7', 5),
  ('Carriera e Sviluppo', 'Career & Development', 'Sviluppo professionale, networking, leadership', 'Professional development, networking, leadership', '🚀', '#DDA0DD', 6),
  ('Lifestyle e Relazioni', 'Lifestyle & Relationships', 'Finanze, sostenibilità, relazioni, famiglia', 'Finance, sustainability, relationships, family', '🌱', '#98D8C8', 7)
ON CONFLICT (id) DO NOTHING;

-- 3. Se la tabella categories esiste ma è vuota o mancano colonne, aggiornala
-- (Esegui questo solo se necessario)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#667eea';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
