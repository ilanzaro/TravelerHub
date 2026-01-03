-- =========================
-- PROFILE INTERESTS (favorites / saved users)
-- =========================
CREATE TABLE profile_interests (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT now(),

    PRIMARY KEY (profile_id, target_profile_id),
    CONSTRAINT no_self_interest CHECK (profile_id <> target_profile_id)
);

ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;

-- User manages own interests
CREATE POLICY "manage own interests"
  ON profile_interests
  FOR ALL
  USING ((SELECT auth.uid()) = profile_id)
  WITH CHECK ((SELECT auth.uid()) = profile_id);

-- =========================
-- Indexes
-- =========================
-- Speed up queries by profile_id
CREATE INDEX idx_profile_interests_profile ON profile_interests(profile_id);
-- Optional: speed up reverse lookups
CREATE INDEX idx_profile_interests_target ON profile_interests(target_profile_id);

-- =========================
-- Function: get favorites ordered by distance
-- Returns target profiles with distance in meters
-- =========================
CREATE OR REPLACE FUNCTION public.get_favorites_nearby(
    p_profile_id UUID,
    p_lng DOUBLE PRECISION,
    p_lat DOUBLE PRECISION,
    p_limit INT
)
RETURNS TABLE(
    target_profile_id UUID,
    distance_meters DOUBLE PRECISION,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, extensions
AS $$
    SELECT
        t.target_profile_id,
        ST_Distance(p.last_location::extensions.geography, ST_MakePoint(p_lng, p_lat)::extensions.geography) AS distance_meters,
        t.created_at
    FROM profile_interests t
    JOIN public.profiles p ON p.id = t.target_profile_id
    WHERE t.profile_id = p_profile_id
    ORDER BY distance_meters
    LIMIT p_limit;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_favorites_nearby(UUID, DOUBLE PRECISION, DOUBLE PRECISION, INT) TO authenticated;