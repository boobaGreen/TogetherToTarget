-- Template form per le principali sottocategorie
-- Da eseguire dopo create_daily_checkin_system.sql

-- 1. FITNESS - Perdita peso
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Perdita peso', 
  1, -- assumendo fitness sia category_id = 1
  '{
    "weight_today": {
      "type": "number",
      "label": "Peso oggi (kg)",
      "placeholder": "70.5",
      "step": 0.1,
      "required": false
    },
    "calories_tracked": {
      "type": "boolean", 
      "label": "Ho tracciato le calorie oggi",
      "required": true
    },
    "exercise_minutes": {
      "type": "number",
      "label": "Minuti di esercizio",
      "placeholder": "30",
      "min": 0,
      "required": true
    },
    "water_intake": {
      "type": "select",
      "label": "Idratazione",
      "options": ["Scarsa", "Normale", "Ottima"],
      "required": true
    },
    "mood_energy": {
      "type": "scale",
      "label": "Energia e umore (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    }
  }'::JSONB,
  1
);

-- 2. FITNESS - Aumento massa
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Aumento massa', 
  1,
  '{
    "weight_today": {
      "type": "number",
      "label": "Peso oggi (kg)",
      "placeholder": "75.2",
      "step": 0.1,
      "required": false
    },
    "protein_intake": {
      "type": "boolean",
      "label": "Ho raggiunto il target proteico",
      "required": true
    },
    "workout_completed": {
      "type": "boolean",
      "label": "Allenamento completato",
      "required": true
    },
    "workout_type": {
      "type": "select",
      "label": "Tipo allenamento",
      "options": ["Upper Body", "Lower Body", "Full Body", "Cardio", "Rest Day"],
      "required": false
    },
    "strength_feeling": {
      "type": "scale",
      "label": "Sensazione di forza (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    }
  }'::JSONB,
  2
);

-- 3. APPRENDIMENTO - Lingua inglese
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Lingua inglese',
  2, -- assumendo apprendimento sia category_id = 2
  '{
    "study_minutes": {
      "type": "number",
      "label": "Minuti di studio",
      "placeholder": "45",
      "min": 0,
      "required": true
    },
    "new_words": {
      "type": "number",
      "label": "Nuove parole imparate",
      "placeholder": "10",
      "min": 0,
      "required": false
    },
    "conversation_practiced": {
      "type": "boolean",
      "label": "Ho praticato conversazione",
      "required": true
    },
    "content_type": {
      "type": "select",
      "label": "Tipo di contenuto studiato",
      "options": ["Video/Film", "Podcast", "Libro", "App/Corso", "Conversazione", "Grammatica"],
      "required": false
    },
    "confidence_level": {
      "type": "scale",
      "label": "Fiducia nel parlare (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    }
  }'::JSONB,
  1
);

-- 4. APPRENDIMENTO - Musica
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Musica',
  2,
  '{
    "practice_minutes": {
      "type": "number",
      "label": "Minuti di pratica",
      "placeholder": "60",
      "min": 0,
      "required": true
    },
    "piece_studied": {
      "type": "text",
      "label": "Brano/Esercizio studiato",
      "placeholder": "Chopin Nocturne Op.9 No.1",
      "required": false
    },
    "technique_focus": {
      "type": "select",
      "label": "Focus tecnico",
      "options": ["Scale", "Arpeggi", "Dinamiche", "Ritmo", "Lettura", "Improvvisazione"],
      "required": false
    },
    "progress_made": {
      "type": "boolean",
      "label": "Ho sentito miglioramenti",
      "required": true
    },
    "enjoyment_level": {
      "type": "scale",
      "label": "Quanto mi sono divertito (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    }
  }'::JSONB,
  2
);

-- 5. CARRIERA - Trovare lavoro
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Trovare lavoro',
  3, -- assumendo carriera sia category_id = 3
  '{
    "applications_sent": {
      "type": "number",
      "label": "Candidature inviate",
      "placeholder": "3",
      "min": 0,
      "required": true
    },
    "linkedin_activity": {
      "type": "boolean",
      "label": "Ho aggiornato LinkedIn/profilo",
      "required": true
    },
    "networking_done": {
      "type": "boolean",
      "label": "Ho fatto networking",
      "required": true
    },
    "skills_improved": {
      "type": "text",
      "label": "Competenze studiate/migliorate",
      "placeholder": "React hooks, SQL queries",
      "required": false
    },
    "motivation_level": {
      "type": "scale",
      "label": "Livello di motivazione (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    }
  }'::JSONB,
  1
);

-- 6. RELAZIONI - Migliorare comunicazione
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Migliorare comunicazione',
  4, -- assumendo relazioni sia category_id = 4
  '{
    "quality_conversations": {
      "type": "number",
      "label": "Conversazioni significative",
      "placeholder": "2",
      "min": 0,
      "required": true
    },
    "active_listening": {
      "type": "boolean",
      "label": "Ho praticato ascolto attivo",
      "required": true
    },
    "conflict_managed": {
      "type": "boolean",
      "label": "Ho gestito un conflitto positivamente",
      "required": false
    },
    "empathy_shown": {
      "type": "scale",
      "label": "Quanto sono stato empatico (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    },
    "relationship_focus": {
      "type": "select",
      "label": "Focus relazionale",
      "options": ["Famiglia", "Amici", "Partner", "Colleghi", "Nuove conoscenze"],
      "required": false
    }
  }'::JSONB,
  1
);

-- 7. BENESSERE - Meditazione
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'Meditazione',
  5, -- assumendo benessere sia category_id = 5
  '{
    "meditation_minutes": {
      "type": "number",
      "label": "Minuti di meditazione",
      "placeholder": "20",
      "min": 0,
      "required": true
    },
    "meditation_type": {
      "type": "select",
      "label": "Tipo di pratica",
      "options": ["Mindfulness", "Respirazione", "Body scan", "Visualizzazione", "Walking", "Loving-kindness"],
      "required": false
    },
    "stress_level": {
      "type": "scale",
      "label": "Livello di stress (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    },
    "mental_clarity": {
      "type": "scale",
      "label": "Chiarezza mentale (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    },
    "grateful_for": {
      "type": "text",
      "label": "Cosa mi ha reso grato oggi",
      "placeholder": "Il supporto dei miei amici",
      "required": false
    }
  }'::JSONB,
  1
);

-- 8. Template generico per sottocategorie non specificate
INSERT INTO checkin_form_templates (subcategory_name, category_id, form_schema, display_order) VALUES (
  'general',
  1, -- categoria fitess come fallback (verrà usato per tutte le categorie)
  '{
    "goal_progress": {
      "type": "scale",
      "label": "Progresso verso l''obiettivo (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    },
    "time_dedicated": {
      "type": "number",
      "label": "Tempo dedicato (minuti)",
      "placeholder": "30",
      "min": 0,
      "required": true
    },
    "challenges_faced": {
      "type": "text",
      "label": "Sfide incontrate",
      "placeholder": "Difficoltà a concentrarmi",
      "required": false
    },
    "satisfaction_level": {
      "type": "scale",
      "label": "Soddisfazione (1-10)",
      "min": 1,
      "max": 10,
      "required": true
    },
    "next_day_plan": {
      "type": "text",
      "label": "Piano per domani",
      "placeholder": "Concentrarmi sulla parte più difficile",
      "required": false
    }
  }'::JSONB,
  999
);

-- Aggiorna timestamp
UPDATE checkin_form_templates SET updated_at = NOW();

SELECT 'Template form personalizzati creati con successo!' as status,
       COUNT(*) as templates_created
FROM checkin_form_templates;
