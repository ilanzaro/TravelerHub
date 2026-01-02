-- =========================
-- CONVERSATIONS
-- One row per user-to-user chat
-- =========================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  last_message_id UUID,
  last_message_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),

  -- =========================
  -- Prevent self-chat
  -- =========================
  CONSTRAINT check_not_self_conversation
    CHECK (user_a <> user_b),

  -- =========================
  -- Order-independent uniqueness
  -- Use generated columns so PostgreSQL UNIQUE works
  -- =========================
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

-- Participants can read their conversations
-- Participants can create conversations only if one participant is themselves
-- Participants can update (last_message fields) only if participant
-- =========================
CREATE POLICY "participants read conversations"
  ON conversations
  FOR SELECT
  USING (
    auth.uid() = user_a
    OR auth.uid() = user_b
  );

-- Participants can create a conversation
CREATE POLICY "participants create conversation"
  ON conversations
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_a
    OR auth.uid() = user_b
  );

-- Participants can update (used internally for last_message*)
CREATE POLICY "participants update conversation"
  ON conversations
  FOR UPDATE
  USING (
    auth.uid() = user_a
    OR auth.uid() = user_b
  );

-- =========================
-- INDEXES
-- =========================
-- Fast retrieval for inbox ordering
CREATE INDEX idx_conversations_last_message
  ON conversations (last_message_at DESC);

-- Fast lookup by user
CREATE INDEX idx_conversations_user_a
  ON conversations (user_a);

CREATE INDEX idx_conversations_user_b
  ON conversations (user_b);

-- =========================
-- VIEW: conversations for current user
-- =========================
-- Returns the conversation id and the other user id for the current user
-- Only includes conversations where current user is participant
-- =========================
CREATE VIEW public.my_conversations AS
SELECT
  c.id,
  CASE
    WHEN c.user_a = auth.uid() THEN c.user_b
    ELSE c.user_a
  END AS other_user_id,
  c.last_message_id,
  c.last_message_at,
  c.created_at
FROM conversations c
WHERE auth.uid() IN (c.user_a, c.user_b);
