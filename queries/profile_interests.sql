-- PROFILE INTERESTS (favorites / saved users)
CREATE TABLE profile_interests (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT now(),

    PRIMARY KEY (profile_id, target_profile_id),
    CONSTRAINT no_self_interest CHECK (profile_id <> target_profile_id)
);

ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;

-- User manages own interests
CREATE POLICY "manage own interests"
  ON profile_interests
  FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);
