-- POPOLAMENTO SUBCATEGORIE 3-4 - CREATIVITÀ E PRODUTTIVITÀ
-- 24 subcategorie validate scientificamente (12+12)
-- Da eseguire nel SQL Editor di Supabase DOPO populate_subcategories_1_2.sql

-- CATEGORIA 3: CREATIVITÀ E HOBBY (12 subcategorie)
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

-- CATEGORIA 4: PRODUTTIVITÀ E ORGANIZZAZIONE (12 subcategorie)
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
  ('Morning routine', 'Morning Routine', 'Routine mattutina strutturata di 30-60 min', 'Structured 30-60 min morning routine', '🌅', 2, 30, ARRAY['Controllo giornata', 'Energia mentale', 'Autoefficacia'], 'Validato: habit apps + productivity trends + routine psychology', 1),
  ('Time blocking', 'Time Blocking', 'Pianificazione giornata con blocchi temporali', 'Daily planning with time blocks', '⏰', 3, 30, ARRAY['Controllo tempo', 'Focus profondo', 'Riduzione ansia'], 'Validato: calendar apps + productivity trends + time management research', 2),
  ('Pomodoro technique', 'Pomodoro Technique', '25 min focus + 5 min pausa, cicli ripetuti', '25 min focus + 5 min break, repeated cycles', '🍅', 2, 30, ARRAY['Concentrazione', 'Gestione energia', 'Completamento task'], 'Validato: Forest + Focus apps + cognitive psychology', 3),
  ('Digital detox', 'Digital Detox', 'Pause programmate da dispositivi digitali', 'Scheduled breaks from digital devices', '📱', 3, 30, ARRAY['Attenzione sostenuta', 'Riduzione ansia', 'Presenza mentale'], 'Validato: digital wellness apps + screen time trends + digital psychology', 4),
  ('Decluttering spazi', 'Space Decluttering', 'Organizzare e semplificare ambienti fisici', 'Organize and simplify physical spaces', '🧹', 2, 30, ARRAY['Chiarezza mentale', 'Controllo ambiente', 'Riduzione stress'], 'Validato: organization apps + Marie Kondo trends + environmental psychology', 5),
  ('GTD system', 'GTD System', 'Getting Things Done: raccolta, elaborazione, azione', 'Getting Things Done: capture, process, action', '📋', 4, 30, ARRAY['Controllo cognitivo', 'Riduzione overwhelm', 'Efficacia decisionale'], 'Validato: Todoist + productivity systems + cognitive load theory', 6),
  ('Email optimization', 'Email Optimization', 'Gestione efficiente email con regole e timing', 'Efficient email management with rules and timing', '📧', 3, 30, ARRAY['Controllo comunicazione', 'Riduzione interruzioni', 'Efficienza lavorativa'], 'Validato: email apps + productivity trends + communication psychology', 7),
  ('Habit stacking', 'Habit Stacking', 'Collegare nuove abitudini a quelle esistenti', 'Connect new habits to existing ones', '🔗', 2, 30, ARRAY['Automatismo comportamentale', 'Facilità adozione', 'Sistemi di vita'], 'Validato: Habitica + habit apps + behavioral psychology', 8),
  ('Weekly planning', 'Weekly Planning', 'Pianificazione settimanale con obiettivi e review', 'Weekly planning with goals and review', '📅', 2, 30, ARRAY['Prospettiva temporale', 'Controllo progresso', 'Allineamento obiettivi'], 'Validato: planning apps + goal setting trends + temporal psychology', 9),
  ('Focus rituals', 'Focus Rituals', 'Rituali pre-lavoro per entrare in flow state', 'Pre-work rituals to enter flow state', '🎯', 3, 30, ARRAY['Flow state', 'Concentrazione profonda', 'Performance cognitiva'], 'Validato: focus apps + flow research + cognitive psychology', 10),
  ('Energy management', 'Energy Management', 'Gestire energia fisica/mentale vs solo tempo', 'Manage physical/mental energy vs just time', '⚡', 3, 30, ARRAY['Sostenibilità performance', 'Autoconoscenza ritmi', 'Prevenzione burnout'], 'Validato: wellness apps + energy trends + circadian psychology', 11),
  ('Automazione digitale', 'Digital Automation', 'Automatizzare task ripetitivi con tool/app', 'Automate repetitive tasks with tools/apps', '🤖', 4, 30, ARRAY['Efficienza sistemica', 'Riduzione carico cognitivo', 'Innovazione personale'], 'Validato: automation tools + productivity trends + cognitive efficiency', 12)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Produttività e Organizzazione';

-- Verifica inserimento categorie 3-4
SELECT 
  c.name_it as categoria,
  COUNT(s.id) as subcategorie_inserite,
  c.sort_order
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
WHERE c.name_it IN ('Creatività e Hobby', 'Produttività e Organizzazione')
GROUP BY c.name_it, c.sort_order
ORDER BY c.sort_order;

-- Totale subcategorie inserite finora
SELECT 
  'TOTALE SUBCATEGORIE INSERITE' as status,
  COUNT(*) as totale
FROM subcategories;
