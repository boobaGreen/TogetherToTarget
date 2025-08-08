-- Creazione tabella users per TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Crea la tabella users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  language text DEFAULT 'it' CHECK (language IN ('it', 'en')),
  timezone text,
  avatar_url text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Policy: gli utenti possono vedere solo i propri dati
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 4. Policy: gli utenti possono aggiornare solo i propri dati  
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 5. Policy: gli utenti possono inserire solo i propri dati
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Funzione per creare automaticamente il profilo utente al signup
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
  );
  RETURN new;
END;
$$;

-- 8. Trigger che esegue la funzione quando si registra un nuovo utente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Commenti per documentazione
COMMENT ON TABLE users IS 'Profili utenti estesi per TogetherToTarget';
COMMENT ON COLUMN users.language IS 'Lingua preferita: it o en';
COMMENT ON COLUMN users.onboarding_completed IS 'True se l''utente ha completato l''onboarding';
