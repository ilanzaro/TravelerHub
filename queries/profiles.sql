-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_urls TEXT[] DEFAULT '{}',

    -- Location
    last_location GEOGRAPHY(Point, 4326),
    last_online TIMESTAMPTZ,

    -- Settings
    settings_show_age BOOLEAN DEFAULT true,
    settings_theme TEXT DEFAULT 'auto',        -- light | dark | auto
    settings_show_distance BOOLEAN DEFAULT true,

    -- Auth metadata
    provider TEXT DEFAULT 'email',             -- email | google
    email_verified BOOLEAN DEFAULT false,

    -- Tags
    tags JSONB DEFAULT '{}'::jsonb,

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT check_settings_theme
        CHECK (settings_theme IN ('light', 'dark', 'auto')),

    CONSTRAINT check_travel_style_exists
        CHECK (
            tags ? 'travel-style'
            AND jsonb_typeof(tags->'travel-style') = 'string'
        )
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read profiles
CREATE POLICY "read profiles"
  ON profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- Users manage their own profile
CREATE POLICY "insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX idx_profiles_location
  ON profiles USING GIST (last_location);

CREATE INDEX idx_profiles_tags
  ON profiles USING GIN (tags);


  -- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
