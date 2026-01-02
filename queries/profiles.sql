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

    country CHAR(2),

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- ✅ Constraints
    CONSTRAINT check_settings_theme
        CHECK (settings_theme IN ('light', 'dark', 'auto')),

    CONSTRAINT check_travel_style_exists
        CHECK (
            tags ? 'travel-style'
            AND jsonb_typeof(tags->'travel-style') = 'string'
        ),

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
