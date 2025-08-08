-- Aggiorna tabella categories esistente e crea le nuove tabelle

-- 1. Aggiungi colonna color mancante a categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#667eea';

-- 2. Aggiorna le categorie con i colori se non ci sono dati
INSERT INTO categories (name_it, name_en, description_it, description_en, emoji, color, sort_order, is_active) VALUES
  ('Fitness e Sport', 'Fitness & Sports', 'Allenamenti, sport, benessere fisico', 'Workouts, sports, physical wellness', '💪', '#FF6B6B', 1, true),
  ('Apprendimento', 'Learning', 'Studio, corsi, nuove competenze', 'Study, courses, new skills', '📚', '#4ECDC4', 2, true),
  ('Creatività', 'Creativity', 'Arte, musica, scrittura, progetti creativi', 'Art, music, writing, creative projects', '🎨', '#45B7D1', 3, true),
  ('Produttività', 'Productivity', 'Organizzazione, abitudini, efficienza', 'Organization, habits, efficiency', '⚡', '#96CEB4', 4, true),
  ('Benessere', 'Wellness', 'Meditazione, mindfulness, salute mentale', 'Meditation, mindfulness, mental health', '🧘', '#FFEAA7', 5, true),
  ('Carriera', 'Career', 'Sviluppo professionale, networking', 'Professional development, networking', '🚀', '#DDA0DD', 6, true),
  ('Relazioni', 'Relationships', 'Migliorare rapporti sociali e familiari', 'Improving social and family relationships', '❤️', '#FFB6C1', 7, true),
  ('Finanze', 'Finance', 'Risparmio, investimenti, gestione denaro', 'Saving, investments, money management', '💰', '#FD79A8', 8, true)
ON CONFLICT (id) DO NOTHING;
