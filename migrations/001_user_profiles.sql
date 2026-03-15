CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  avatar_url      TEXT,
  onboarded       BOOLEAN     DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT false,
  notification_hour INT,
  signup_date     DATE        DEFAULT CURRENT_DATE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "profiles_own" ON user_profiles USING (id = auth.uid());
