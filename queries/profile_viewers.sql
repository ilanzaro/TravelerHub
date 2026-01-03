-- =========================
-- PROFILE VIEWERS (48h)
-- =========================
CREATE TABLE profile_viewers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    viewed_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '48 hours'),

    CONSTRAINT no_self_view CHECK (profile_id <> viewer_id),
    CONSTRAINT unique_profile_view UNIQUE (profile_id, viewer_id)
);

ALTER TABLE profile_viewers ENABLE ROW LEVEL SECURITY;

-- Profile owner sees viewers
CREATE POLICY "owner reads viewers"
  ON profile_viewers
  FOR SELECT
  USING ((SELECT auth.uid()) = profile_id);

-- Viewer inserts
CREATE POLICY "viewer inserts"
  ON profile_viewers
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = viewer_id);

-- Index
CREATE INDEX idx_profile_viewers_expires
  ON profile_viewers (expires_at);

-- Optional cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_profile_viewers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM public.profile_viewers
  WHERE expires_at < now();
END;
$$;