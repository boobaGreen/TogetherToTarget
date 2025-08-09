-- Aggiornamento schema per sistema Premium
-- Da eseguire nel SQL Editor di Supabase

-- 1. Aggiungi colonne Premium alla tabella users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expires_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_type text CHECK (subscription_type IN ('free', 'premium_monthly', 'premium_yearly'));

-- 2. Aggiorna default per nuovi utenti
ALTER TABLE users ALTER COLUMN subscription_type SET DEFAULT 'free';

-- 3. Modifica user_profiles per supportare obiettivi multipli
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS priority integer DEFAULT 1;

-- 4. Indici per performance Premium
CREATE INDEX IF NOT EXISTS users_is_premium_idx ON users(is_premium);
CREATE INDEX IF NOT EXISTS users_premium_expires_idx ON users(premium_expires_at);
CREATE INDEX IF NOT EXISTS user_profiles_is_active_idx ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS user_profiles_priority_idx ON user_profiles(priority);

-- 5. Policy per multiple profiles (Premium users)
CREATE OR REPLACE FUNCTION can_create_profile(user_id uuid)
RETURNS boolean AS $$
DECLARE
    user_premium boolean;
    active_profiles_count integer;
BEGIN
    -- Controlla se l'utente è premium
    SELECT is_premium INTO user_premium FROM users WHERE id = user_id;
    
    -- Conta profili attivi esistenti
    SELECT COUNT(*) INTO active_profiles_count 
    FROM user_profiles 
    WHERE id = user_id AND is_active = true;
    
    -- Logica: Premium può avere 5 profili, Free solo 1
    IF user_premium THEN
        RETURN active_profiles_count < 5;
    ELSE
        RETURN active_profiles_count < 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger per validare creazione profili
CREATE OR REPLACE FUNCTION validate_profile_creation()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT can_create_profile(NEW.id) THEN
        RAISE EXCEPTION 'Profile limit reached. Upgrade to Premium for multiple goals.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica trigger
DROP TRIGGER IF EXISTS validate_profile_limit ON user_profiles;
CREATE TRIGGER validate_profile_limit
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_profile_creation();

-- 7. Funzione per controllare limiti Premium
CREATE OR REPLACE FUNCTION get_user_limits(user_id uuid)
RETURNS JSON AS $$
DECLARE
    user_premium boolean;
    active_profiles integer;
    max_profiles integer;
BEGIN
    SELECT is_premium INTO user_premium FROM users WHERE id = user_id;
    SELECT COUNT(*) INTO active_profiles FROM user_profiles WHERE id = user_id AND is_active = true;
    
    max_profiles := CASE WHEN user_premium THEN 5 ELSE 1 END;
    
    RETURN json_build_object(
        'is_premium', user_premium,
        'active_profiles', active_profiles,
        'max_profiles', max_profiles,
        'can_add_goal', active_profiles < max_profiles
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Commenti documentazione
COMMENT ON COLUMN users.is_premium IS 'Se l''utente ha sottoscrizione Premium attiva';
COMMENT ON COLUMN users.premium_expires_at IS 'Data scadenza abbonamento Premium';
COMMENT ON COLUMN users.subscription_type IS 'Tipo abbonamento: free, premium_monthly, premium_yearly';
COMMENT ON COLUMN user_profiles.is_active IS 'Se il profilo/obiettivo è attualmente attivo';
COMMENT ON COLUMN user_profiles.priority IS 'Priorità obiettivo (1=primario, 2=secondario)';

-- 9. Verifica aggiornamento
SELECT 'Schema Premium aggiornato con successo!' as status;

-- 10. Mostra nuove colonne
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'user_profiles') 
    AND column_name IN ('is_premium', 'premium_expires_at', 'subscription_type', 'is_active', 'priority')
ORDER BY table_name, column_name;
