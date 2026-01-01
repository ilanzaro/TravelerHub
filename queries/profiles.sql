CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),       -- matches auth.uid()
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_urls TEXT[] DEFAULT '{}',

    -- Location
    last_location GEOGRAPHY(Point, 4326),
    last_online TIMESTAMPTZ,

    -- Settings
    settings_show_age BOOLEAN DEFAULT true,
    settings_theme TEXT DEFAULT 'auto',                 -- 'light' | 'dark' | 'auto'
    settings_show_distance BOOLEAN DEFAULT true,

    -- Auth
    provider TEXT DEFAULT 'email',                      -- 'email' | 'google'
    email_verified BOOLEAN DEFAULT false,

    -- Tags
    tags JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- ✅ ONLY SIMPLE CHECKS (Postgres-safe)
    CONSTRAINT check_settings_theme
        CHECK (settings_theme IN ('light', 'dark', 'auto')),

    CONSTRAINT check_travel_style_exists
        CHECK (
            tags ? 'travel-style'
            AND jsonb_typeof(tags->'travel-style') = 'string'
        )
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Authenticated users can read profiles"
  ON profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);