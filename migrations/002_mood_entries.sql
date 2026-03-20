-- Table principale pour stocker les entrées d'humeur des utilisateurs
CREATE TABLE IF NOT EXISTS mood_entries (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  
  -- Données d'humeur
  mood_category         TEXT        NOT NULL CHECK (mood_category IN (
    'melancholie', 'energie', 'paix', 'colere', 
    'nostalgie', 'amour', 'anxiete', 'gratitude'
  )),
  mood_text             TEXT,
  intensity_score       INT         CHECK (intensity_score >= 1 AND intensity_score <= 10),
  
  -- Configuration du style de frame
  style_id              TEXT        NOT NULL,
  style_config          JSONB       DEFAULT '{}'::jsonb,
  
  -- Média et export
  image_url             TEXT,
  export_format         TEXT        NOT NULL DEFAULT 'story' CHECK (export_format IN (
    'story', 'wallpaper', 'square', 'desktop'
  )),
  
  -- Métadonnées
  is_shared_globally    BOOLEAN     DEFAULT false,
  ai_generated          BOOLEAN     DEFAULT false,
  ai_prompt             TEXT,
  
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood_category ON mood_entries(mood_category);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created ON mood_entries(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres entrées
CREATE POLICY "mood_entries_select_own" ON mood_entries
  FOR SELECT
  USING (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent insérer leurs propres entrées
CREATE POLICY "mood_entries_insert_own" ON mood_entries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent mettre à jour leurs propres entrées
CREATE POLICY "mood_entries_update_own" ON mood_entries
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent supprimer leurs propres entrées
CREATE POLICY "mood_entries_delete_own" ON mood_entries
  FOR DELETE
  USING (user_id = auth.uid());

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_mood_entries_updated_at
  BEFORE UPDATE ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
