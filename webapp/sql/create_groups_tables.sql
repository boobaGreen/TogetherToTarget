-- Tabelle per sistema gruppi e matching TogetherToTarget
-- Da eseguire nel SQL Editor di Supabase

-- 1. Tabella user_profiles (estensione dei profili utente per matching)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  goal_description TEXT NOT NULL,
  goal_deadline DATE,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  preferred_meeting_times TEXT[] DEFAULT '{}',
  timezone TEXT DEFAULT 'Europe/Rome',
  availability_hours TEXT DEFAULT 'flexible', -- morning, afternoon, evening, flexible
  matching_preferences JSONB DEFAULT '{}', -- preferences aggiuntive per matching
  is_available_for_matching BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabella groups
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('forming', 'active', 'completed', 'cancelled')) DEFAULT 'forming',
  max_members INTEGER DEFAULT 3,
  meeting_frequency TEXT DEFAULT 'weekly', -- weekly, biweekly, monthly
  meeting_day_of_week INTEGER, -- 0=Sunday, 1=Monday, etc.
  meeting_time TIME,
  timezone TEXT DEFAULT 'Europe/Rome',
  chat_enabled BOOLEAN DEFAULT true,
  video_meetings_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabella group_members (relazione many-to-many)
CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member', 'leader', 'admin')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  weekly_checkin_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 4. Tabella group_activities (per tracking progresso)
CREATE TABLE IF NOT EXISTS group_activities (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT CHECK (activity_type IN ('checkin', 'goal_update', 'meeting_attended', 'message_sent')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabella matching_queue (per gestire richieste di matching)
CREATE TABLE IF NOT EXISTS matching_queue (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) NOT NULL,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  matched_at TIMESTAMPTZ,
  group_id INTEGER REFERENCES groups(id),
  UNIQUE(user_id, category_id)
);

-- 6. Abilita RLS su tutte le tabelle
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_queue ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies per user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. RLS Policies per groups
CREATE POLICY "Users can view groups they belong to" ON groups
  FOR SELECT USING (
    id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Group leaders can update their groups" ON groups
  FOR UPDATE USING (created_by = auth.uid());

-- 9. RLS Policies per group_members
CREATE POLICY "Users can view members of their groups" ON group_members
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can update their own membership" ON group_members
  FOR UPDATE USING (user_id = auth.uid());

-- 10. RLS Policies per group_activities
CREATE POLICY "Users can view activities of their groups" ON group_activities
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can insert their own activities" ON group_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 11. RLS Policies per matching_queue
CREATE POLICY "Users can view own matching requests" ON matching_queue
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own matching requests" ON matching_queue
  FOR ALL USING (user_id = auth.uid());

-- 12. Triggers per updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at 
  BEFORE UPDATE ON groups 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Funzioni di utilità per matching
CREATE OR REPLACE FUNCTION get_user_current_group(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT gm.group_id 
    FROM group_members gm
    JOIN groups g ON g.id = gm.group_id
    WHERE gm.user_id = user_uuid 
    AND gm.is_active = true
    AND g.status = 'active'
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_user_available_for_matching(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT up.is_available_for_matching 
    FROM user_profiles up
    WHERE up.id = user_uuid
    AND NOT EXISTS (
      SELECT 1 FROM group_members gm
      JOIN groups g ON g.id = gm.group_id
      WHERE gm.user_id = user_uuid 
      AND gm.is_active = true
      AND g.status IN ('forming', 'active')
    )
  );
END;
$$;

-- 14. Commenti per documentazione
COMMENT ON TABLE user_profiles IS 'Profili utente estesi per sistema di matching';
COMMENT ON TABLE groups IS 'Gruppi di supporto per obiettivi condivisi';
COMMENT ON TABLE group_members IS 'Membri dei gruppi con ruoli e statistiche';
COMMENT ON TABLE group_activities IS 'Log delle attività dei gruppi per tracking progresso';
COMMENT ON TABLE matching_queue IS 'Coda per richieste di matching automatico';
