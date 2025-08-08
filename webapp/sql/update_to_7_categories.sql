-- AGGIORNAMENTO A 7 CATEGORIE CONSOLIDATE
-- Da eseguire nel SQL Editor di Supabase

-- 1. Disattiva tutte le categorie esistenti
UPDATE categories SET is_active = false;

-- 2. Inserisci le 7 nuove categorie consolidate
INSERT INTO categories (name_it, name_en, description_it, description_en, emoji, color, sort_order, is_active) VALUES
  ('Salute e Fitness', 'Health & Fitness', 'Benessere fisico, sport, alimentazione, salute mentale', 'Physical wellness, sports, nutrition, mental health', '🏃', '#FF6B6B', 1, true),
  ('Studio e Competenze', 'Study & Skills', 'Lingue, certificazioni, corsi, formazione', 'Languages, certifications, courses, training', '📚', '#4ECDC4', 2, true),
  ('Creatività e Hobby', 'Creativity & Hobbies', 'Arte, musica, scrittura, progetti creativi', 'Art, music, writing, creative projects', '🎨', '#45B7D1', 3, true),
  ('Produttività e Organizzazione', 'Productivity & Organization', 'Gestione tempo, routine, abitudini, efficienza', 'Time management, routines, habits, efficiency', '⚡', '#96CEB4', 4, true),
  ('Mindfulness e Crescita', 'Mindfulness & Growth', 'Meditazione, sviluppo personale, benessere mentale', 'Meditation, personal development, mental wellness', '🧘', '#FFEAA7', 5, true),
  ('Carriera e Sviluppo', 'Career & Development', 'Sviluppo professionale, networking, leadership', 'Professional development, networking, leadership', '🚀', '#DDA0DD', 6, true),
  ('Lifestyle e Relazioni', 'Lifestyle & Relationships', 'Finanze, sostenibilità, relazioni, famiglia', 'Finance, sustainability, relationships, family', '🌱', '#98D8C8', 7, true)
ON CONFLICT (name_it) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  description_it = EXCLUDED.description_it,
  description_en = EXCLUDED.description_en,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 3. Verifica risultato
SELECT id, name_it, name_en, emoji, color, sort_order, is_active 
FROM categories 
WHERE is_active = true 
ORDER BY sort_order;
