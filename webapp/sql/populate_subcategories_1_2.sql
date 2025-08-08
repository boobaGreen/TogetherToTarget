-- POPOLAMENTO SUBCATEGORIE - 77 VALIDATE SCIENTIFICAMENTE
-- Basato sulla ricerca completa con tripla validazione
-- Da eseguire nel SQL Editor di Supabase DOPO create_subcategories_table.sql

-- Prima recuperiamo gli ID delle categorie
WITH category_ids AS (
  SELECT id, name_it 
  FROM categories 
  WHERE is_active = true
)

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
FROM category_ids c
CROSS JOIN (VALUES
  -- Salute e Fitness subcategorie
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

-- CATEGORIA 2: STUDIO E COMPETENZE (9 subcategorie)  
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
FROM category_ids c
CROSS JOIN (VALUES
  ('Lingua straniera', 'Foreign Language', '30 minuti al giorno di studio linguistico', '30 minutes daily language study', '🌍', 3, 30, ARRAY['Neuroplasticità', 'Fiducia comunicativa', 'Apertura culturale'], 'Validato: Duolingo + trends + ricerca bilinguismo', 1),
  ('Lettura formativa', 'Educational Reading', 'Un libro/articolo educativo a settimana', 'One educational book/article per week', '📖', 2, 30, ARRAY['Crescita intellettuale', 'Concentrazione', 'Pensiero critico'], 'Validato: app reading + trends + psicologia apprendimento', 2),
  ('Skill digitali', 'Digital Skills', 'Corsi online su competenze tecnologiche', 'Online courses on tech skills', '💻', 3, 30, ARRAY['Autoefficacia digitale', 'Adattabilità', 'Competenza professionale'], 'Validato: Coursera + trends + ricerca e-learning', 3),
  ('Scrittura creativa', 'Creative Writing', 'Scrivere 500 parole al giorno', 'Write 500 words daily', '✍️', 2, 30, ARRAY['Espressione emotiva', 'Chiarezza mentale', 'Creatività'], 'Validato: app writing + trends + psicologia scrittura', 4),
  ('Certificazioni pro', 'Pro Certifications', 'Studiare per certificazioni professionali', 'Study for professional certifications', '🏆', 4, 30, ARRAY['Competenza professionale', 'Fiducia lavorativa', 'Crescita carriera'], 'Validato: LinkedIn Learning + trends + career psychology', 5),
  ('Matematica pratica', 'Practical Math', 'Risolvere problemi matematici quotidiani', 'Solve daily math problems', '🔢', 2, 30, ARRAY['Logica', 'Problem solving', 'Fiducia numerica'], 'Validato: app math + trends + ricerca cognizione', 6),
  ('Public speaking', 'Public Speaking', 'Praticare presentazioni e discorsi', 'Practice presentations and speeches', '🎤', 3, 30, ARRAY['Fiducia sociale', 'Leadership', 'Comunicazione efficace'], 'Validato: Toastmasters + trends + psicologia sociale', 7),
  ('Memoria e focus', 'Memory & Focus', 'Tecniche di memorizzazione e concentrazione', 'Memory and concentration techniques', '🧠', 2, 30, ARRAY['Capacità cognitive', 'Attenzione sostenuta', 'Efficienza mentale'], 'Validato: app brain training + trends + neuroscienza', 8),
  ('Podcast educativi', 'Educational Podcasts', 'Ascoltare 3 podcast formativi a settimana', 'Listen to 3 educational podcasts weekly', '🎧', 1, 30, ARRAY['Apprendimento passivo', 'Curiosità', 'Aggiornamento continuo'], 'Validato: Spotify + trends + psicologia ascolto', 9)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Studio e Competenze';

-- Verifica inserimento categorie 1-2
SELECT 
  c.name_it as categoria,
  COUNT(s.id) as subcategorie_inserite
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
WHERE c.name_it IN ('Salute e Fitness', 'Studio e Competenze')
GROUP BY c.name_it, c.sort_order
ORDER BY c.sort_order;
