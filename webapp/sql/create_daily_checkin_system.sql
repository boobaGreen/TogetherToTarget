-- Sistema Daily Check-in per TogetherToTarget
-- Da eseguire dopo aver configurato users, groups, e categories

-- 1. Tabella principale per check-in quotidiani
CREATE TABLE IF NOT EXISTS daily_checkins (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Identificazione categoria/sottocategoria per personalizzazione form
  category_id INTEGER NOT NULL REFERENCES categories(id),
  subcategory_name TEXT NOT NULL, -- nome sottocategoria per matching form type
  
  -- Data e timing
  target_date DATE NOT NULL, -- giorno per cui è il check-in
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  grace_period_ends_at TIMESTAMPTZ NOT NULL, -- target_date + 72 ore
  
  -- Dati del check-in (flessibile JSONB per ogni tipo di sottocategoria)
  responses JSONB NOT NULL DEFAULT '{}',
  
  -- Sharing e social
  shared_with_group BOOLEAN DEFAULT true,
  notes TEXT, -- note opzionali per il gruppo
  
  -- Metadata
  completion_status TEXT CHECK (completion_status IN ('completed', 'partial', 'missed', 'auto_closed')) DEFAULT 'completed',
  streak_day INTEGER DEFAULT 1, -- giorno consecutivo dello streak
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: un check-in per utente per giorno per categoria
  UNIQUE(user_id, target_date, category_id)
);

-- 2. Tabella per streak tracking (separata per performance)
CREATE TABLE IF NOT EXISTS user_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  subcategory_name TEXT NOT NULL,
  
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  
  -- Statistiche
  total_checkins INTEGER DEFAULT 0,
  total_missed INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, category_id, subcategory_name)
);

-- 3. Tabella per reminder sistema
CREATE TABLE IF NOT EXISTS checkin_reminders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_date DATE NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('24h_before', '12h_before', 'custom')) NOT NULL,
  
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  email_sent BOOLEAN DEFAULT false,
  
  status TEXT CHECK (status IN ('scheduled', 'sent', 'cancelled')) DEFAULT 'scheduled',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabella per template form personalizzati per sottocategoria
CREATE TABLE IF NOT EXISTS checkin_form_templates (
  id SERIAL PRIMARY KEY,
  subcategory_name TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  
  -- Schema del form in JSON
  form_schema JSONB NOT NULL DEFAULT '{}',
  
  -- Esempi:
  -- Per "Perdita peso": {"weight": "number", "calories_target": "boolean", "steps": "number"}
  -- Per "Lingua inglese": {"words_studied": "number", "conversation_minutes": "number", "content_consumed": "boolean"}
  -- Per "Musica": {"practice_minutes": "number", "song_studied": "text", "improvement_felt": "boolean"}
  
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Abilita RLS su tutte le tabelle
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_form_templates ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies per daily_checkins
CREATE POLICY "Users can view own checkins" ON daily_checkins
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own checkins" ON daily_checkins
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own checkins within grace period" ON daily_checkins
  FOR UPDATE USING (
    user_id = auth.uid() AND 
    NOW() <= grace_period_ends_at
  );

-- Group members possono vedere check-in condivisi del loro gruppo
CREATE POLICY "Group members can view shared checkins" ON daily_checkins
  FOR SELECT USING (
    shared_with_group = true AND
    group_id IN (
      SELECT gm.group_id 
      FROM group_members gm 
      WHERE gm.user_id = auth.uid() AND gm.is_active = true
    )
  );

-- 7. RLS Policies per user_streaks
CREATE POLICY "Users can view own streaks" ON user_streaks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own streaks" ON user_streaks
  FOR ALL USING (user_id = auth.uid());

-- 8. RLS Policies per checkin_reminders
CREATE POLICY "Users can view own reminders" ON checkin_reminders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage reminders" ON checkin_reminders
  FOR ALL USING (true); -- Sistema deve poter gestire reminder

-- 9. RLS Policies per checkin_form_templates (pubblico read-only)
CREATE POLICY "Anyone can view form templates" ON checkin_form_templates
  FOR SELECT USING (is_active = true);

-- Solo admin possono modificare (per ora tutti possono, da restringere in futuro)
CREATE POLICY "Authenticated users can manage templates" ON checkin_form_templates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 10. Triggers per updated_at
CREATE TRIGGER update_daily_checkins_updated_at 
  BEFORE UPDATE ON daily_checkins 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at 
  BEFORE UPDATE ON user_streaks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkin_form_templates_updated_at 
  BEFORE UPDATE ON checkin_form_templates 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 11. Funzioni di utilità

-- Calcola grace period (72 ore dopo target_date)
CREATE OR REPLACE FUNCTION calculate_grace_period_end(target_date DATE)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN (target_date + INTERVAL '1 day' + INTERVAL '72 hours')::TIMESTAMPTZ;
END;
$$;

-- Aggiorna streak quando viene fatto check-in
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_streak_val INTEGER := 0;
  last_date DATE;
BEGIN
  -- Trova streak attuale per questa categoria/sottocategoria
  SELECT current_streak, last_checkin_date 
  INTO current_streak_val, last_date
  FROM user_streaks 
  WHERE user_id = NEW.user_id 
    AND category_id = NEW.category_id 
    AND subcategory_name = NEW.subcategory_name;

  -- Se non esiste record streak, crealo
  IF NOT FOUND THEN
    INSERT INTO user_streaks (
      user_id, category_id, subcategory_name, 
      current_streak, longest_streak, last_checkin_date, total_checkins
    ) VALUES (
      NEW.user_id, NEW.category_id, NEW.subcategory_name,
      1, 1, NEW.target_date, 1
    );
  ELSE
    -- Aggiorna streak esistente
    IF NEW.target_date = last_date + INTERVAL '1 day' THEN
      -- Streak continua
      current_streak_val := current_streak_val + 1;
    ELSIF NEW.target_date > last_date + INTERVAL '1 day' THEN
      -- Streak rotto, ricomicia da 1
      current_streak_val := 1;
    ELSE
      -- Check-in per giorno passato, non cambiare streak
      current_streak_val := current_streak_val;
    END IF;

    UPDATE user_streaks SET
      current_streak = current_streak_val,
      longest_streak = GREATEST(longest_streak, current_streak_val),
      last_checkin_date = NEW.target_date,
      total_checkins = total_checkins + 1,
      updated_at = NOW()
    WHERE user_id = NEW.user_id 
      AND category_id = NEW.category_id 
      AND subcategory_name = NEW.subcategory_name;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger per aggiornare streak automaticamente
CREATE TRIGGER update_streak_on_checkin
  AFTER INSERT ON daily_checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- 12. Funzione per auto-close check-in scaduti
CREATE OR REPLACE FUNCTION auto_close_expired_checkins()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  closed_count INTEGER := 0;
BEGIN
  -- Trova tutti i giorni passati senza check-in per utenti attivi
  -- e crea check-in "missed" automaticamente
  
  WITH missing_checkins AS (
    SELECT DISTINCT 
      up.id as user_id,
      up.category_id,
      (CURRENT_DATE - INTERVAL '1 day')::DATE as target_date
    FROM user_profiles up
    WHERE up.is_available_for_matching = true
      AND NOT EXISTS (
        SELECT 1 FROM daily_checkins dc 
        WHERE dc.user_id = up.id 
          AND dc.category_id = up.category_id
          AND dc.target_date = (CURRENT_DATE - INTERVAL '1 day')::DATE
      )
      AND (CURRENT_DATE - INTERVAL '1 day')::DATE >= CURRENT_DATE - INTERVAL '7 days' -- solo ultimi 7 giorni
  )
  INSERT INTO daily_checkins (
    user_id, category_id, subcategory_name, target_date, 
    grace_period_ends_at, responses, completion_status, shared_with_group
  )
  SELECT 
    mc.user_id, mc.category_id, 
    'general', -- sottocategoria di default
    mc.target_date,
    calculate_grace_period_end(mc.target_date),
    '{"auto_closed": true}'::JSONB,
    'missed',
    false -- non condividere auto-close
  FROM missing_checkins mc;

  GET DIAGNOSTICS closed_count = ROW_COUNT;
  
  RETURN closed_count;
END;
$$;

-- 13. Commenti per documentazione
COMMENT ON TABLE daily_checkins IS 'Check-in quotidiani personalizzati per ogni sottocategoria';
COMMENT ON COLUMN daily_checkins.responses IS 'Dati JSONB personalizzati in base al tipo di sottocategoria';
COMMENT ON COLUMN daily_checkins.grace_period_ends_at IS 'Finestra di 72 ore per completare check-in';
COMMENT ON TABLE user_streaks IS 'Tracking streak e statistiche per motivazione utente';
COMMENT ON TABLE checkin_form_templates IS 'Template form personalizzati per ogni sottocategoria';

-- 14. Indici per performance
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_grace_period ON daily_checkins(grace_period_ends_at) WHERE completion_status != 'missed';
CREATE INDEX IF NOT EXISTS idx_daily_checkins_group_shared ON daily_checkins(group_id, shared_with_group) WHERE shared_with_group = true;
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_category ON user_streaks(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_checkin_reminders_scheduled ON checkin_reminders(scheduled_at, status) WHERE status = 'scheduled';

SELECT 'Sistema Daily Check-in creato con successo!' as status;
