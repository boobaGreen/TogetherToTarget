-- Creazione sistema preferenze matching per TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Crea la tabella user_matching_preferences
CREATE TABLE IF NOT EXISTS user_matching_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Dimensione gruppo preferita
  preferred_group_size integer CHECK (preferred_group_size IN (2, 3, 0)) DEFAULT 3, -- 0 = any
  flexible_on_size boolean DEFAULT true,
  
  -- Lingue per videocall
  videocall_languages text[] NOT NULL DEFAULT ARRAY['it'],
  flexible_on_language boolean DEFAULT true,
  
  -- Timezone e flessibilità
  timezone text NOT NULL DEFAULT 'Europe/Rome',
  timezone_flexibility boolean DEFAULT true,
  
  -- Metadati
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE user_matching_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Rimuovi policy esistenti se presenti (per evitare errori)
DROP POLICY IF EXISTS "Users can view own matching preferences" ON user_matching_preferences;
DROP POLICY IF EXISTS "Users can update own matching preferences" ON user_matching_preferences;
DROP POLICY IF EXISTS "Users can insert own matching preferences" ON user_matching_preferences;
DROP POLICY IF EXISTS "Users can delete own matching preferences" ON user_matching_preferences;

-- 4. Crea le policy di sicurezza
CREATE POLICY "Users can view own matching preferences" ON user_matching_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own matching preferences" ON user_matching_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own matching preferences" ON user_matching_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own matching preferences" ON user_matching_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_matching_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_matching_preferences_updated_at ON user_matching_preferences;
CREATE TRIGGER update_matching_preferences_updated_at 
  BEFORE UPDATE ON user_matching_preferences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_matching_preferences_timestamp();

-- 6. Indici per performance
CREATE INDEX IF NOT EXISTS user_matching_preferences_user_id_idx ON user_matching_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_matching_preferences_group_size_idx ON user_matching_preferences(preferred_group_size);
CREATE INDEX IF NOT EXISTS user_matching_preferences_languages_idx ON user_matching_preferences USING GIN (videocall_languages);
CREATE INDEX IF NOT EXISTS user_matching_preferences_timezone_idx ON user_matching_preferences(timezone);
CREATE INDEX IF NOT EXISTS user_matching_preferences_flexible_idx ON user_matching_preferences(flexible_on_size, flexible_on_language, timezone_flexibility);

-- 7. Crea la tabella matching_pool per utenti in attesa
CREATE TABLE IF NOT EXISTS matching_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  objective text NOT NULL,
  category text NOT NULL,
  subcategory text,
  timezone text NOT NULL,
  priority integer DEFAULT 0, -- 0=normal, 1=high (dopo 72h)
  entered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. RLS per matching_pool
ALTER TABLE matching_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matching pool entry" ON matching_pool
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own matching pool entry" ON matching_pool
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matching pool entry" ON matching_pool
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own matching pool entry" ON matching_pool
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Indici per matching_pool
CREATE INDEX IF NOT EXISTS matching_pool_user_id_idx ON matching_pool(user_id);
CREATE INDEX IF NOT EXISTS matching_pool_category_idx ON matching_pool(category);
CREATE INDEX IF NOT EXISTS matching_pool_subcategory_idx ON matching_pool(subcategory);
CREATE INDEX IF NOT EXISTS matching_pool_timezone_idx ON matching_pool(timezone);
CREATE INDEX IF NOT EXISTS matching_pool_priority_idx ON matching_pool(priority);
CREATE INDEX IF NOT EXISTS matching_pool_entered_at_idx ON matching_pool(entered_at);

-- 10. Trigger per matching_pool timestamp
DROP TRIGGER IF EXISTS update_matching_pool_updated_at ON matching_pool;
CREATE TRIGGER update_matching_pool_updated_at 
  BEFORE UPDATE ON matching_pool 
  FOR EACH ROW 
  EXECUTE FUNCTION update_matching_preferences_timestamp();

-- 11. Crea tabella match_analytics per calcolo tempi di attesa
CREATE TABLE IF NOT EXISTS match_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  subcategory text,
  wait_time_hours integer NOT NULL,
  group_size integer NOT NULL,
  timezone_spread integer DEFAULT 0, -- Differenza max timezone nel gruppo
  language_compatibility text DEFAULT 'perfect', -- 'perfect', 'partial', 'translated'
  matched_at timestamptz DEFAULT now()
);

-- 12. Indici per analytics
CREATE INDEX IF NOT EXISTS match_analytics_category_idx ON match_analytics(category);
CREATE INDEX IF NOT EXISTS match_analytics_subcategory_idx ON match_analytics(subcategory);
CREATE INDEX IF NOT EXISTS match_analytics_wait_time_idx ON match_analytics(wait_time_hours);
CREATE INDEX IF NOT EXISTS match_analytics_matched_at_idx ON match_analytics(matched_at);

-- 13. Crea tabella email_queue per notifiche
CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type text NOT NULL, -- 'weekly_recall', 'match_found', 'level_escalation'
  email_data jsonb NOT NULL DEFAULT '{}',
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 14. Indici per email_queue
CREATE INDEX IF NOT EXISTS email_queue_user_id_idx ON email_queue(user_id);
CREATE INDEX IF NOT EXISTS email_queue_type_idx ON email_queue(email_type);
CREATE INDEX IF NOT EXISTS email_queue_scheduled_idx ON email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS email_queue_sent_idx ON email_queue(sent_at);

-- 15. Commenti per documentazione
COMMENT ON TABLE user_matching_preferences IS 'Preferenze utente per il sistema di matching progressivo';
COMMENT ON COLUMN user_matching_preferences.preferred_group_size IS '2=duetto, 3=trio, 0=qualsiasi';
COMMENT ON COLUMN user_matching_preferences.videocall_languages IS 'Lingue accettate per videocall';
COMMENT ON COLUMN user_matching_preferences.timezone_flexibility IS 'Accetta fusi orari diversi per match migliori';

COMMENT ON TABLE matching_pool IS 'Pool di utenti in attesa di match';
COMMENT ON COLUMN matching_pool.priority IS '0=normale, 1=alta priorità (dopo 72h)';

COMMENT ON TABLE match_analytics IS 'Analytics per calcolo tempi di attesa e ottimizzazione algoritmo';
COMMENT ON TABLE email_queue IS 'Coda email per notifiche automatiche';

-- 16. Inserimento preferenze default per utenti esistenti
INSERT INTO user_matching_preferences (user_id, preferred_group_size, videocall_languages, timezone)
SELECT 
  id,
  3, -- Default trio
  ARRAY['it'], -- Default italiano
  'Europe/Rome' -- Default timezone italiano
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_matching_preferences WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- 17. Verifica creazione
SELECT 'Sistema matching preferences creato con successo!' as status;
SELECT COUNT(*) as "Utenti con preferenze" FROM user_matching_preferences;
SELECT COUNT(*) as "Utenti in matching pool" FROM matching_pool;
