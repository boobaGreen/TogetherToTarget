-- Aggiunta campo motivazione opzionale alla tabella user_profiles
-- Da eseguire nel SQL Editor di Supabase

-- 1. Aggiungi campo motivazione opzionale
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS motivation TEXT;

-- 2. Aggiungi commento per documentazione
COMMENT ON COLUMN user_profiles.motivation IS 'Motivazione personale dell''utente (opzionale)';

-- 3. Verifica della migrazione
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'motivation';

-- 4. Test di inserimento per verificare che funzioni
SELECT 'Migrazione completata! Campo motivation aggiunto come TEXT NULL' as status;
