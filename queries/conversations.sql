-- =========================
-- CONVERSATIONS
-- One row per user-to-user chat
-- =========================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  last_message_id UUID,
  last_message_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),

  -- Prevent self-chat
  CONSTRAINT check_not_self_conversation
    CHECK (user_a <> user_b),

  -- Order-independent uniqueness
  user_low  UUID GENERATED ALWAYS AS (LEAST(user_a, user_b)) STORED,
  user_high UUID GENERATED ALWAYS AS (GREATEST(user_a, user_b)) STORED,
  CONSTRAINT unique_conversation_pair UNIQUE (user_low, user_high)
);

-- =========================
-- Enable Row-Level Security
-- =========================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- =========================
-- RLS POLICIES
-- =========================
DROP POLICY IF EXISTS "participants read conversations" ON conversations;
CREATE POLICY "participants read conversations"
  ON conversations
  FOR SELECT
  USING (
    (SELECT auth.uid()) = user_a
    OR (SELECT auth.uid()) = user_b
  );

DROP POLICY IF EXISTS "participants create conversation" ON conversations;
CREATE POLICY "participants create conversation"
  ON conversations
  FOR INSERT
  WITH CHECK (
    (SELECT auth.uid()) = user_a
    OR (SELECT auth.uid()) = user_b
  );

DROP POLICY IF EXISTS "participants update conversation" ON conversations;
CREATE POLICY "participants update conversation"
  ON conversations
  FOR UPDATE
  USING (
    (SELECT auth.uid()) = user_a
    OR (SELECT auth.uid()) = user_b
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_a
    OR (SELECT auth.uid()) = user_b
  );

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_conversations_last_message
  ON conversations (last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_user_a
  ON conversations (user_a);

CREATE INDEX IF NOT EXISTS idx_conversations_user_b
  ON conversations (user_b);

CREATE INDEX IF NOT EXISTS idx_conversations_user_low
  ON conversations (user_low);

CREATE INDEX IF NOT EXISTS idx_conversations_user_high
  ON conversations (user_high);

-- =========================
-- VIEW: conversations for current user
-- SECURITY INVOKER ensures RLS applies
-- =========================
CREATE OR REPLACE VIEW public.my_conversations
WITH (security_invoker = true) AS
SELECT
  c.id,
  CASE
    WHEN c.user_a = (SELECT auth.uid()) THEN c.user_b
    ELSE c.user_a
  END AS other_user_id,
  c.last_message_id,
  c.last_message_at,
  c.created_at
FROM conversations c
WHERE (SELECT auth.uid()) IN (c.user_a, c.user_b);

-- =========================
-- Function: update last message safely
-- =========================
CREATE OR REPLACE FUNCTION public.update_conversation_last_message(
  p_conversation_id uuid,
  p_last_message_id uuid,
  p_last_message_at timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_id = p_last_message_id,
    last_message_at = p_last_message_at
  WHERE id = p_conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'conversation % not found', p_conversation_id;
  END IF;
END;
$$;

-- Correct privileges
REVOKE EXECUTE ON FUNCTION public.update_conversation_last_message(uuid, uuid, timestamptz) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_conversation_last_message(uuid, uuid, timestamptz) TO authenticated;
