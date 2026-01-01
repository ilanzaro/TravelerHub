CREATE TABLE profile_viewers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL
      REFERENCES profiles(id) ON DELETE CASCADE,

    viewer_id UUID NOT NULL
      REFERENCES profiles(id) ON DELETE CASCADE,

    viewed_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '48 hours'),

    CONSTRAINT unique_profile_view UNIQUE (profile_id, viewer_id)
);

ALTER TABLE profile_viewers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can see viewers"
  ON profile_viewers
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Viewer can insert record"
  ON profile_viewers
  FOR INSERT
  WITH CHECK (auth.uid() = viewer_id);