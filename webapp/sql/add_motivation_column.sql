-- Aggiunta colonna motivation alla tabella user_profiles esistente
-- Esegui SOLO questa query se la tabella user_profiles esiste già ma manca la colonna motivation

-- Verifica se la colonna motivation esiste
DO $$
BEGIN
    -- Aggiungi la colonna motivation se non esiste
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'motivation'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN motivation text;
        RAISE NOTICE 'Colonna motivation aggiunta con successo!';
    ELSE
        RAISE NOTICE 'Colonna motivation già esistente.';
    END IF;
END $$;

-- Verifica il risultato
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
