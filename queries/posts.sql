-- POSTS (postcard | travelmate)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

    type TEXT NOT NULL CHECK (type IN ('postcard', 'travelmate')),
    description TEXT,
    photo_url TEXT,

    location GEOGRAPHY(Point, 4326),

    tags JSONB,

    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '48 hours')
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Read (only non-expired)
CREATE POLICY "read active posts"
  ON posts
  FOR SELECT
  USING (expires_at > now());

-- Insert
CREATE POLICY "insert own post"
  ON posts
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())= user_id);

-- Update
CREATE POLICY "update own post"
  ON posts
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Delete
CREATE POLICY "delete own post"
  ON posts
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- Indexes
CREATE INDEX idx_posts_location
  ON posts USING GIST (location);

CREATE INDEX idx_posts_expires
  ON posts (expires_at);
