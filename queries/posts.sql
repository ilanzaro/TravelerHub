CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,           -- 'postcard' | 'travelmate'
    description TEXT,
    photo_url TEXT,               -- optional
    location GEOGRAPHY(Point, 4326),
    tags JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '48 hours'),

    CONSTRAINT check_post_type
      CHECK (type IN ('postcard', 'travelmate'))
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read posts"
  ON posts
  FOR SELECT
  USING (true);

CREATE POLICY "Owner can insert posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can delete posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

