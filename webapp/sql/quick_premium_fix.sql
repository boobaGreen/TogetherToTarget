-- Script Rapido per aggiungere funzionalità Premium
-- Eseguire questo nel SQL Editor di Supabase per risolvere gli errori immediati

-- 1. Aggiungi colonne Premium alla tabella users (se non esistono)
DO $$ 
BEGIN
    -- Aggiungi is_premium se non esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_premium') THEN
        ALTER TABLE users ADD COLUMN is_premium boolean DEFAULT false;
    END IF;
    
    -- Aggiungi premium_expires_at se non esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='premium_expires_at') THEN
        ALTER TABLE users ADD COLUMN premium_expires_at timestamptz;
    END IF;
    
    -- Aggiungi subscription_type se non esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_type') THEN
        ALTER TABLE users ADD COLUMN subscription_type text CHECK (subscription_type IN ('free', 'premium_monthly', 'premium_yearly')) DEFAULT 'free';
    END IF;
END $$;

-- 2. Crea funzione get_user_limits se non esiste
CREATE OR REPLACE FUNCTION get_user_limits(user_id uuid)
RETURNS JSON AS $$
DECLARE
    user_premium boolean;
    active_profiles integer;
    max_profiles integer;
BEGIN
    -- Controlla se l'utente è premium (fallback a false se non trovato)
    SELECT COALESCE(is_premium, false) INTO user_premium FROM users WHERE id = user_id;
    
    -- Conta profili attivi esistenti (fallback a 1 se tabella user_profiles non ha colonna is_active)
    BEGIN
        SELECT COUNT(*) INTO active_profiles FROM user_profiles WHERE id = user_id AND COALESCE(is_active, true) = true;
    EXCEPTION WHEN OTHERS THEN
        SELECT COUNT(*) INTO active_profiles FROM user_profiles WHERE id = user_id;
    END;
    
    -- Determina limiti: Premium = 5, Free = 1
    max_profiles := CASE WHEN user_premium THEN 5 ELSE 1 END;
    
    RETURN json_build_object(
        'is_premium', COALESCE(user_premium, false),
        'active_profiles', COALESCE(active_profiles, 0),
        'max_profiles', max_profiles,
        'can_add_goal', COALESCE(active_profiles, 0) < max_profiles
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Aggiorna tutti gli utenti esistenti come free se NULL
UPDATE users SET 
    is_premium = false,
    subscription_type = 'free'
WHERE is_premium IS NULL OR subscription_type IS NULL;

-- 4. Verifica funzionamento
SELECT 'Sistema Premium base configurato con successo!' as status;

-- Test rapido della funzione
SELECT get_user_limits('33c348fe-2e28-4cc7-a184-b178f73d27ea') as test_result;
