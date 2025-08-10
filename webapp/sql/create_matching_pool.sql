-- CREAZIONE TABELLA MATCHING POOL
-- Sistema di matching progressivo TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Crea la tabella matching_pool (se non esiste) e aggiunge le colonne mancanti
CREATE TABLE IF NOT EXISTS matching_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective text NOT NULL,
  category text NOT NULL,
  subcategory text,
  timezone text NOT NULL DEFAULT 'Europe/Rome',
  priority integer DEFAULT 0,
  entered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Aggiungi colonne mancanti se non esistono
DO $$ 
BEGIN
  -- Aggiorna constraint priority se esisteva già senza check
  BEGIN
    ALTER TABLE matching_pool DROP CONSTRAINT IF EXISTS matching_pool_priority_check;
    ALTER TABLE matching_pool ADD CONSTRAINT matching_pool_priority_check CHECK (priority IN (0, 1));
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore if constraint already exists
  END;

  -- Aggiungi preferred_group_size se non esiste
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matching_pool' AND column_name='preferred_group_size') THEN
    ALTER TABLE matching_pool ADD COLUMN preferred_group_size integer DEFAULT 0;
  END IF;
  
  -- Aggiungi constraint per preferred_group_size
  BEGIN
    ALTER TABLE matching_pool DROP CONSTRAINT IF EXISTS matching_pool_preferred_group_size_check;
    ALTER TABLE matching_pool ADD CONSTRAINT matching_pool_preferred_group_size_check CHECK (preferred_group_size IN (0, 2, 3));
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Aggiungi languages se non esiste
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matching_pool' AND column_name='languages') THEN
    ALTER TABLE matching_pool ADD COLUMN languages text[] DEFAULT ARRAY['it'];
  END IF;

  -- Aggiungi flexible_on_language se non esiste
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matching_pool' AND column_name='flexible_on_language') THEN
    ALTER TABLE matching_pool ADD COLUMN flexible_on_language boolean DEFAULT true;
  END IF;

  -- Aggiungi current_level se non esiste
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matching_pool' AND column_name='current_level') THEN
    ALTER TABLE matching_pool ADD COLUMN current_level text DEFAULT 'perfect';
  END IF;
  
  -- Aggiungi constraint per current_level
  BEGIN
    ALTER TABLE matching_pool DROP CONSTRAINT IF EXISTS matching_pool_current_level_check;
    ALTER TABLE matching_pool ADD CONSTRAINT matching_pool_current_level_check CHECK (current_level IN ('perfect', 'good', 'acceptable', 'fallback'));
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Aggiungi escalation_count se non esiste
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='matching_pool' AND column_name='escalation_count') THEN
    ALTER TABLE matching_pool ADD COLUMN escalation_count integer DEFAULT 0;
  END IF;
END $$;

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE matching_pool ENABLE ROW LEVEL SECURITY;

-- 3. Policy: utenti possono vedere solo i propri record (ricrea se esiste)
DROP POLICY IF EXISTS "Users can view own matching pool entry" ON matching_pool;
CREATE POLICY "Users can view own matching pool entry" ON matching_pool
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Policy: utenti possono inserire/aggiornare solo i propri record (ricrea se esiste)
DROP POLICY IF EXISTS "Users can manage own matching pool entry" ON matching_pool;
CREATE POLICY "Users can manage own matching pool entry" ON matching_pool
  FOR ALL USING (auth.uid() = user_id);

-- 5. Policy: sistema può leggere tutto per algoritmo matching (ricrea se esiste)
DROP POLICY IF EXISTS "Service role can read all for matching" ON matching_pool;
CREATE POLICY "Service role can read all for matching" ON matching_pool
  FOR SELECT USING (auth.role() = 'service_role');

-- 6. Trigger per aggiornare updated_at automaticamente (ricrea se esiste)
CREATE OR REPLACE FUNCTION update_matching_pool_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_matching_pool_updated_at_trigger ON matching_pool;
CREATE TRIGGER update_matching_pool_updated_at_trigger
  BEFORE UPDATE ON matching_pool
  FOR EACH ROW
  EXECUTE FUNCTION update_matching_pool_updated_at();

-- 7. Indici per performance algoritmo matching (crea solo se non esistono)
CREATE INDEX IF NOT EXISTS idx_matching_pool_category ON matching_pool(category);
CREATE INDEX IF NOT EXISTS idx_matching_pool_subcategory ON matching_pool(subcategory);
CREATE INDEX IF NOT EXISTS idx_matching_pool_timezone ON matching_pool(timezone);
CREATE INDEX IF NOT EXISTS idx_matching_pool_priority ON matching_pool(priority DESC);
CREATE INDEX IF NOT EXISTS idx_matching_pool_entered_at ON matching_pool(entered_at);
CREATE INDEX IF NOT EXISTS idx_matching_pool_level ON matching_pool(current_level);
CREATE INDEX IF NOT EXISTS idx_matching_pool_group_size ON matching_pool(preferred_group_size);

-- Indice composto per query di matching frequenti
CREATE INDEX IF NOT EXISTS idx_matching_pool_matching_query ON matching_pool(
  category, 
  current_level, 
  priority DESC, 
  entered_at
);

-- 8. Funzione per inserire utente nel pool con preferenze automatiche
CREATE OR REPLACE FUNCTION enter_matching_pool(
  p_user_id uuid,
  p_objective text,
  p_category text,
  p_subcategory text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_pool_entry_id uuid;
  v_user_preferences record;
  v_timezone text;
BEGIN
  -- Ottieni timezone utente (fallback a Europe/Rome)
  SELECT timezone INTO v_timezone 
  FROM user_matching_preferences 
  WHERE user_id = p_user_id;
  
  IF v_timezone IS NULL THEN
    v_timezone := 'Europe/Rome';
  END IF;
  
  -- Ottieni preferenze utente (con fallback)
  SELECT 
    COALESCE(preferred_group_size, 0) as group_size,
    COALESCE(videocall_languages, ARRAY['it']) as languages,
    COALESCE(flexible_on_language, true) as flexible_lang
  INTO v_user_preferences
  FROM user_matching_preferences 
  WHERE user_id = p_user_id;
  
  -- Se non ha preferenze, usa default
  IF v_user_preferences IS NULL THEN
    v_user_preferences := ROW(0, ARRAY['it'], true);
  END IF;
  
  -- Inserisci nel pool (o aggiorna se esiste già)
  INSERT INTO matching_pool (
    user_id,
    objective,
    category,
    subcategory,
    timezone,
    preferred_group_size,
    languages,
    flexible_on_language,
    priority,
    current_level,
    escalation_count
  ) VALUES (
    p_user_id,
    p_objective,
    p_category,
    p_subcategory,
    v_timezone,
    v_user_preferences.group_size,
    v_user_preferences.languages,
    v_user_preferences.flexible_lang,
    0, -- priority normale
    'perfect', -- inizia dal livello perfect
    0 -- nessuna escalation ancora
  )
  ON CONFLICT (user_id) DO UPDATE SET
    objective = EXCLUDED.objective,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    timezone = EXCLUDED.timezone,
    preferred_group_size = EXCLUDED.preferred_group_size,
    languages = EXCLUDED.languages,
    flexible_on_language = EXCLUDED.flexible_on_language,
    entered_at = now(), -- Reset timer
    current_level = 'perfect', -- Reset a livello perfect
    escalation_count = 0, -- Reset escalation
    updated_at = now()
  RETURNING id INTO v_pool_entry_id;
  
  RETURN v_pool_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Funzione per rimuovere utente dal pool
CREATE OR REPLACE FUNCTION exit_matching_pool(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  DELETE FROM matching_pool WHERE user_id = p_user_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Funzione per ottenere status matching utente
CREATE OR REPLACE FUNCTION get_user_matching_status(p_user_id uuid)
RETURNS TABLE(
  in_pool boolean,
  objective text,
  category text,
  subcategory text,
  current_level text,
  hours_in_pool numeric,
  escalation_count integer,
  estimated_next_escalation_hours numeric
) AS $$
DECLARE
  v_pool_entry record;
BEGIN
  -- Cerca entry nel pool
  SELECT * INTO v_pool_entry 
  FROM matching_pool 
  WHERE user_id = p_user_id;
  
  IF v_pool_entry IS NULL THEN
    -- Non nel pool
    RETURN QUERY SELECT false, NULL::text, NULL::text, NULL::text, NULL::text, 0::numeric, 0, 0::numeric;
  ELSE
    -- Nel pool - calcola ore e prossima escalation
    DECLARE
      v_hours_in_pool numeric;
      v_next_escalation_hours numeric;
    BEGIN
      v_hours_in_pool := EXTRACT(EPOCH FROM (now() - v_pool_entry.entered_at)) / 3600;
      
      -- Calcola prossima escalation
      v_next_escalation_hours := CASE v_pool_entry.current_level
        WHEN 'perfect' THEN 24 - v_hours_in_pool
        WHEN 'good' THEN 48 - v_hours_in_pool
        WHEN 'acceptable' THEN 72 - v_hours_in_pool
        ELSE 0
      END;
      
      RETURN QUERY SELECT 
        true,
        v_pool_entry.objective,
        v_pool_entry.category,
        v_pool_entry.subcategory,
        v_pool_entry.current_level,
        v_hours_in_pool,
        v_pool_entry.escalation_count,
        GREATEST(v_next_escalation_hours, 0);
    END;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. View per statistiche pool (per dashboard admin)
CREATE OR REPLACE VIEW matching_pool_stats AS
SELECT 
  category,
  subcategory,
  current_level,
  COUNT(*) as users_count,
  AVG(EXTRACT(EPOCH FROM (now() - entered_at)) / 3600) as avg_hours_waiting,
  MIN(entered_at) as oldest_entry,
  MAX(priority) as has_priority_users
FROM matching_pool
GROUP BY category, subcategory, current_level
ORDER BY category, subcategory, current_level;

-- 12. Commenti per documentazione
COMMENT ON TABLE matching_pool IS 'Pool di utenti in ricerca di match - Sistema progressivo 4 livelli';
COMMENT ON COLUMN matching_pool.current_level IS 'Livello matching: perfect (0-24h), good (24-48h), acceptable (48-72h), fallback (72h+)';
COMMENT ON COLUMN matching_pool.priority IS 'Priorità: 0=normale, 1=alta (dopo 72h o escalation manuale)';
COMMENT ON COLUMN matching_pool.escalation_count IS 'Numero di escalation automatiche subite';
COMMENT ON FUNCTION enter_matching_pool IS 'Inserisce utente nel pool con preferenze automatiche da user_matching_preferences';
COMMENT ON FUNCTION get_user_matching_status IS 'Restituisce status completo matching per un utente';

-- 13. Verifica creazione e mostra struttura finale
SELECT 'Tabella matching_pool e funzioni create/aggiornate con successo!' as status;

-- Mostra struttura della tabella
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'matching_pool' 
ORDER BY ordinal_position;

-- 14. Grant permissions per Edge Functions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON matching_pool TO anon, authenticated;
GRANT EXECUTE ON FUNCTION enter_matching_pool TO anon, authenticated;
GRANT EXECUTE ON FUNCTION exit_matching_pool TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_matching_status TO anon, authenticated;
