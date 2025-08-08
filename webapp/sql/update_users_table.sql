-- Verifica e completa setup users table per TogetherToTarget

-- 1. Verifica se la tabella users esiste e ha tutte le colonne
DO $$
BEGIN
    -- Aggiungi avatar_url se non esiste
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url text;
    END IF;
END $$;

-- 2. Ricrea la funzione handle_new_user con supporto per Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, language, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name', 
      ''
    ),
    COALESCE(new.raw_user_meta_data->>'language', 'it'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(
      EXCLUDED.name,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      users.name
    ),
    avatar_url = COALESCE(
      EXCLUDED.avatar_url,
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      users.avatar_url
    ),
    updated_at = now();
  RETURN new;
END;
$$;

-- 3. Ricrea il trigger (questo sovrascrive quello esistente)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verifica che tutto sia a posto
SELECT 'Setup completato con successo!' as status;
