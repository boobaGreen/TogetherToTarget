-- POPOLAMENTO COMPLETO: TUTTE LE 77 SUBCATEGORIE VALIDATE
-- Da eseguire nel SQL Editor di Supabase DOPO il test minimo
-- Questo script aggiunge le restanti 74 subcategorie (7 + 67)

-- =====================================================
-- COMPLETIAMO SALUTE E FITNESS (altre 7 subcategorie)
-- =====================================================

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
  ('Allenamento forza', 'Strength Training', 'Esercizi di resistenza 2-3 volte a settimana', 'Resistance exercises 2-3 times per week', '💪', 3, 30, ARRAY['Autoefficacia', 'Disciplina', 'Miglioramento autostima'], 'Validato: app fitness + trends + psicologia sport', 4),
  ('Idratazione consapevole', 'Mindful Hydration', 'Bere almeno 8 bicchieri d''acqua al giorno', 'Drink at least 8 glasses of water daily', '💧', 1, 30, ARRAY['Energia fisica', 'Chiarezza mentale', 'Abitudini salutari'], 'Validato: app salute + trends + psicologia abitudini', 5),
  ('Alimentazione mindful', 'Mindful Eating', 'Mangiare con consapevolezza e senza distrazioni', 'Eating with awareness and without distractions', '🥗', 2, 30, ARRAY['Controllo impulsi', 'Consapevolezza corporea', 'Digestione'], 'Validato: app nutrizione + trends + psicologia alimentare', 6),
  ('Stretching quotidiano', 'Daily Stretching', '10-15 minuti di stretching ogni giorno', '10-15 minutes of daily stretching', '🤸‍♀️', 1, 30, ARRAY['Rilassamento muscolare', 'Mindfulness corporea', 'Prevenzione dolori'], 'Validato: app fitness + trends + fisioterapia', 7),
  ('Meditazione movimento', 'Movement Meditation', 'Tai chi, qi gong o danza mindful', 'Tai chi, qi gong or mindful dance', '🕺', 2, 30, ARRAY['Coordinazione mente-corpo', 'Calma interiore', 'Creatività movimento'], 'Validato: app mindfulness + trends + ricerca corpo-mente', 8),
  ('Respirazione consapevole', 'Conscious Breathing', 'Tecniche di respirazione 2-3 volte al giorno', 'Breathing techniques 2-3 times daily', '🌬️', 1, 30, ARRAY['Controllo ansia', 'Presenza mentale', 'Regolazione sistema nervoso'], 'Validato: app meditation + trends + neuroscienza', 9),
  ('Attività outdoor', 'Outdoor Activities', 'Almeno 3 sessioni settimanali all''aperto', 'At least 3 weekly outdoor sessions', '🌳', 2, 30, ARRAY['Connessione natura', 'Vitamina D', 'Riduzione stress urbano'], 'Validato: app outdoor + trends + psicologia ambientale', 10)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Salute e Fitness'
ON CONFLICT (category_id, name_it) DO NOTHING;

-- =====================================================
-- STUDIO E COMPETENZE (9 subcategorie)
-- =====================================================

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

-- =====================================================
-- CREATIVITÀ E HOBBY (12 subcategorie)
-- =====================================================

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
  ('Disegno quotidiano', 'Daily Drawing', 'Sketch o disegno di 15-30 minuti al giorno', '15-30 minute daily sketch or drawing', '✏️', 2, 30, ARRAY['Creatività', 'Mindfulness', 'Espressione emotiva'], 'Validato: Procreate + Pinterest trends + art therapy research', 1),
  ('Fotografia creativa', 'Creative Photography', 'Una foto artistica al giorno con tema', 'One artistic photo daily with theme', '📸', 2, 30, ARRAY['Osservazione', 'Creatività visiva', 'Mindfulness presente'], 'Validato: Instagram + camera apps + visual psychology', 2),
  ('Scrittura creativa', 'Creative Writing', '500 parole di fiction/poesia al giorno', '500 words of fiction/poetry daily', '📝', 3, 30, ARRAY['Espressione emotiva', 'Narrativa personale', 'Chiarezza mentale'], 'Validato: Medium + writing apps + narrative therapy', 3),
  ('Musica quotidiana', 'Daily Music', 'Suonare strumento o comporre 20-30 min', 'Play instrument or compose 20-30 min', '🎵', 3, 30, ARRAY['Coordinazione', 'Espressione emotiva', 'Flow state'], 'Validato: music apps + Spotify trends + music therapy', 4),
  ('Cucina creativa', 'Creative Cooking', 'Sperimentare una nuova ricetta ogni 2-3 giorni', 'Try new recipe every 2-3 days', '👨‍🍳', 2, 30, ARRAY['Creatività pratica', 'Mindfulness sensoriale', 'Nutrimento'], 'Validato: cooking apps + food trends + culinary therapy', 5),
  ('Artigianato DIY', 'DIY Crafting', 'Progetti manuali: uncinetto, falegnameria, ceramica', 'Hand projects: crochet, woodwork, ceramics', '🧵', 3, 30, ARRAY['Concentrazione', 'Soddisfazione tangibile', 'Mindfulness tattile'], 'Validato: Pinterest + craft apps + occupational therapy', 6),
  ('Danza espressiva', 'Expressive Dance', 'Movimento libero o coreografie 15-20 min', 'Free movement or choreography 15-20 min', '💃', 2, 30, ARRAY['Espressione corporea', 'Liberazione emotiva', 'Fiducia corporea'], 'Validato: TikTok + dance apps + dance therapy research', 7),
  ('Giardinaggio urbano', 'Urban Gardening', 'Cura piante, erbe aromatiche, mini orto', 'Plant care, herbs, mini garden', '🌱', 2, 30, ARRAY['Connessione natura', 'Pazienza', 'Responsabilità nurturing'], 'Validato: gardening apps + sustainability trends + horticultural therapy', 8),
  ('Design digitale', 'Digital Design', 'Grafiche, loghi, design UI/UX quotidiani', 'Graphics, logos, daily UI/UX design', '🎨', 4, 30, ARRAY['Problem solving visivo', 'Creatività tecnica', 'Competenza digitale'], 'Validato: Adobe + Figma + design trends + creative psychology', 9),
  ('Video creativity', 'Video Creativity', 'Brevi video creativi: editing, storytelling', 'Short creative videos: editing, storytelling', '🎬', 3, 30, ARRAY['Storytelling', 'Competenza tecnica', 'Espressione narrativa'], 'Validato: YouTube + TikTok + video apps + media psychology', 10),
  ('Lettura creativa', 'Creative Reading', 'Fiction, poesia, graphic novel con journal', 'Fiction, poetry, graphic novels with journaling', '📚', 2, 30, ARRAY['Immaginazione', 'Empatia narrativa', 'Espansione prospettive'], 'Validato: Goodreads + reading apps + bibliotherapy research', 11),
  ('Arte terapeutica', 'Therapeutic Art', 'Art journaling, mandala, arte espressiva', 'Art journaling, mandala, expressive art', '🌈', 2, 30, ARRAY['Processamento emotivo', 'Mindfulness', 'Autoconoscenza'], 'Validato: art therapy apps + wellness trends + expressive arts therapy', 12)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Creatività e Hobby';

-- VERIFICA PARZIALE
SELECT 
  c.name_it as categoria,
  COUNT(s.id) as subcategorie_inserite
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
WHERE c.name_it IN ('Salute e Fitness', 'Studio e Competenze', 'Creatività e Hobby')
GROUP BY c.name_it, c.sort_order
ORDER BY c.sort_order;
