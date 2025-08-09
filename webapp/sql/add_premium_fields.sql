-- Aggiunta campi Premium alla tabella users
-- Da eseguire nel SQL Editor di Supabase

-- 1. Aggiungi colonna subscription_type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_type text DEFAULT 'free' 
CHECK (subscription_type IN ('free', 'premium_monthly', 'premium_yearly'));

-- 2. Aggiungi colonna is_premium 
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- 3. Aggiungi colonna premium_expires_at
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS premium_expires_at timestamptz;

-- 4. Crea un indice per performance
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type, is_premium);

-- 5. Aggiorna tutti gli utenti esistenti per essere sicuri
UPDATE users 
SET 
  subscription_type = COALESCE(subscription_type, 'free'),
  is_premium = COALESCE(is_premium, false)
WHERE subscription_type IS NULL OR is_premium IS NULL;

-- 6. Aggiungi commenti per documentazione
COMMENT ON COLUMN users.subscription_type IS 'Tipo di sottoscrizione: free, premium_monthly, premium_yearly';
COMMENT ON COLUMN users.is_premium IS 'True se l''utente ha un abbonamento Premium attivo';
COMMENT ON COLUMN users.premium_expires_at IS 'Data di scadenza dell''abbonamento Premium';

-- 7. Funzione per aggiornare automaticamente is_premium basandosi su subscription_type e data scadenza
CREATE OR REPLACE FUNCTION update_premium_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Aggiorna is_premium basandosi su subscription_type e scadenza
    IF NEW.subscription_type IN ('premium_monthly', 'premium_yearly') THEN
        IF NEW.premium_expires_at IS NULL OR NEW.premium_expires_at > NOW() THEN
            NEW.is_premium = true;
        ELSE
            NEW.is_premium = false;
            -- Se scaduto, reimposta a free
            NEW.subscription_type = 'free';
        END IF;
    ELSE
        NEW.is_premium = false;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger per aggiornare automaticamente is_premium
CREATE TRIGGER trigger_update_premium_status
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_premium_status();

-- 9. Per test: rendi un utente Premium (sostituisci l'email con quella dell'utente di test)
-- UNCOMMENT AND UPDATE EMAIL FOR TESTING:
-- UPDATE users 
-- SET 
--   subscription_type = 'premium_monthly',
--   is_premium = true,
--   premium_expires_at = NOW() + INTERVAL '30 days'
-- WHERE email = 'YOUR_TEST_EMAIL@example.com';

SELECT 'Campi Premium aggiunti con successo!' as status;
