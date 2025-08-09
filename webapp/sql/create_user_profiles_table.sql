-- Creazione tabella user_profiles per TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Crea la tabella user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  goal_description text NOT NULL,
  goal_deadline timestamptz,
  experience_level text NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  motivation text, -- Campo motivazione opzionale
  preferred_meeting_times text[] DEFAULT '{}',
  timezone text NOT NULL DEFAULT 'Europe/Rome',
  availability_hours text NOT NULL DEFAULT 'flexible',
  matching_preferences jsonb NOT NULL DEFAULT '{"meeting_frequency": "weekly"}'::jsonb,
  is_available_for_matching boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Rimuovi policy esistenti se presenti (per evitare errori)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 4. Crea le policy di sicurezza
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);

-- 5. Trigger per aggiornare updated_at automaticamente (solo se non esiste)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Indici per performance
CREATE INDEX IF NOT EXISTS user_profiles_category_id_idx ON user_profiles(category_id);
CREATE INDEX IF NOT EXISTS user_profiles_subcategory_id_idx ON user_profiles(subcategory_id);
CREATE INDEX IF NOT EXISTS user_profiles_experience_level_idx ON user_profiles(experience_level);
CREATE INDEX IF NOT EXISTS user_profiles_is_available_idx ON user_profiles(is_available_for_matching);
CREATE INDEX IF NOT EXISTS user_profiles_created_at_idx ON user_profiles(created_at);

-- 7. Commenti per documentazione
COMMENT ON TABLE user_profiles IS 'Profili utenti completi con obiettivi e preferenze di matching per TogetherToTarget';
COMMENT ON COLUMN user_profiles.category_id IS 'Categoria principale dell''obiettivo';
COMMENT ON COLUMN user_profiles.subcategory_id IS 'Sottocategoria specifica dell''obiettivo (opzionale)';
COMMENT ON COLUMN user_profiles.goal_description IS 'Descrizione dell''obiettivo personale';
COMMENT ON COLUMN user_profiles.goal_deadline IS 'Scadenza per raggiungere l''obiettivo (opzionale)';
COMMENT ON COLUMN user_profiles.experience_level IS 'Livello di esperienza: beginner, intermediate, advanced';
COMMENT ON COLUMN user_profiles.motivation IS 'Motivazione personale (opzionale)';
COMMENT ON COLUMN user_profiles.preferred_meeting_times IS 'Giorni della settimana preferiti per gli incontri';
COMMENT ON COLUMN user_profiles.timezone IS 'Fuso orario dell''utente';
COMMENT ON COLUMN user_profiles.availability_hours IS 'Orari di disponibilità: morning, afternoon, evening, flexible';
COMMENT ON COLUMN user_profiles.matching_preferences IS 'Preferenze per il matching in formato JSON';
COMMENT ON COLUMN user_profiles.is_available_for_matching IS 'Se l''utente è disponibile per essere abbinato ad altri';

-- 8. Verifica creazione
SELECT 'Tabella user_profiles creata con successo!' as status;

-- 9. Mostra schema della tabella
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
