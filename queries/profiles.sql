-- =========================
-- PROFILES TABLE
-- =========================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- link to auth.users

    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_urls TEXT[] DEFAULT '{}',

    -- Location
    last_location GEOGRAPHY(Point, 4326),
    last_online TIMESTAMPTZ,

    -- Settings
    settings_show_age BOOLEAN DEFAULT true,         -- if false, birth_date will not be exposed publicly
    settings_theme TEXT DEFAULT 'auto',             -- light | dark | auto
    settings_show_distance BOOLEAN DEFAULT true,    -- if false, last_location will not be exposed publicly

    -- Auth metadata
    provider TEXT DEFAULT 'email',            -- email | google
    email_verified BOOLEAN DEFAULT false,

    -- Tags
    tags JSONB DEFAULT '{}'::jsonb,           -- user interests / travel style etc.

    country CHAR(2),                           -- ISO 3166-1 alpha-2 code

    -- Birthday
    birth_date DATE,                           -- private by default, only exposed if settings_show_age = true

    -- Bio
    bio TEXT,                                  -- public field; can be empty, optional

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- ✅ Constraints
    CONSTRAINT check_settings_theme
        CHECK (settings_theme IN ('light', 'dark', 'auto')),

    CONSTRAINT check_travel_style_exists
        CHECK (tags ? 'travel-style' AND jsonb_typeof(tags->'travel-style') = 'string'),

    CONSTRAINT check_country_iso
        CHECK (country IN (
            'AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ',
            'BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI',
            'KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ',
            'DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FK','FO','FJ','FI','FR','GF','PF','TF',
            'GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY',
            'HT','HM','VA','HN','HK','HU',
            'IS','IN','ID','IR','IQ','IE','IM','IL','IT',
            'JM','JP','JE','JO',
            'KZ','KE','KI','KP','KR','KW','KG',
            'LA','LV','LB','LS','LR','LY','LI','LT','LU',
            'MO','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM',
            'NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MK','MP','NO','OM',
            'PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA',
            'RE','RO','RU','RW',
            'BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'
        ))
);

-- =========================
-- Enable Row-Level Security
-- =========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =========================
-- PRIVATE ACCESS POLICIES
-- User can see and update their own profile
-- =========================
CREATE POLICY "private access select"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "private access update"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =========================
-- PUBLIC ACCESS POLICY
-- Other authenticated users can see only public fields
-- =========================
CREATE POLICY "public access"
  ON profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- =========================
-- Public profile view
-- Only available to authenticated users
-- Respects settings_show_age and settings_show_distance
-- =========================
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT
    id,
    name,
    avatar_urls,
    tags,
    country,
    last_online,
    bio,
    CASE WHEN settings_show_distance THEN last_location ELSE NULL END AS last_location,
    CASE WHEN settings_show_age THEN birth_date ELSE NULL END AS birth_date
FROM profiles
WHERE deleted_at IS NULL;

-- Revoke access from unauthenticated users
REVOKE ALL ON public.profiles_public FROM public;
-- Grant access only to authenticated users (Supabase role)
GRANT SELECT ON public.profiles_public TO anon;

-- =========================
-- Indexes
-- =========================
CREATE INDEX idx_profiles_location ON profiles USING GIST(last_location);
CREATE INDEX idx_profiles_tags ON profiles USING GIN(tags);

-- =========================
-- Nearby profiles function
-- Returns profiles within a radius (meters) of a point
-- =========================
CREATE OR REPLACE FUNCTION public.nearby_profiles(
  user_lng DOUBLE PRECISION,
  user_lat DOUBLE PRECISION,
  radius_meters INTEGER
)
RETURNS SETOF public.profiles_public
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT *
  FROM public.profiles_public
  WHERE
    last_location IS NOT NULL
    AND ST_DWithin(
      last_location,
      ST_MakePoint(user_lng, user_lat)::geography,
      radius_meters
    );
$$;

-- =========================
-- Auto-create profile on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
