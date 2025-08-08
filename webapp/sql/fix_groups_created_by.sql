-- Aggiungi la colonna created_by alla tabella groups se non esiste
-- Da eseguire prima di create_groups_system.sql se la colonna manca

DO $$
BEGIN
  -- Verifica se la colonna created_by esiste
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'groups' AND column_name = 'created_by'
  ) THEN
    -- Aggiungi la colonna
    ALTER TABLE groups ADD COLUMN created_by UUID REFERENCES auth.users(id);
    
    -- Aggiorna i record esistenti (se ce ne sono) con un valore di default
    -- In questo caso, impostiamo il primo utente disponibile come creatore
    UPDATE groups 
    SET created_by = (SELECT id FROM auth.users LIMIT 1)
    WHERE created_by IS NULL;
    
    RAISE NOTICE 'Colonna created_by aggiunta alla tabella groups';
  ELSE
    RAISE NOTICE 'Colonna created_by già esistente nella tabella groups';
  END IF;
END $$;
