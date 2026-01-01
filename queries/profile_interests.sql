CREATE TABLE profile_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    favorite_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;

-- Only owner can view
CREATE POLICY "Owner can view interests"
  ON profile_interests
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Only owner can insert
CREATE POLICY "Owner can add interest"
  ON profile_interests
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
