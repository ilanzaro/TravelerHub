-- MESSAGES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  conversation_id UUID NOT NULL
    REFERENCES conversations(id) ON DELETE CASCADE,

  sender_id UUID NOT NULL
    REFERENCES profiles(id) ON DELETE CASCADE,

  receiver_id UUID NOT NULL
    REFERENCES profiles(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  read_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),

  -- Validation: sender ≠ receiver
  CONSTRAINT check_sender_receiver_different
    CHECK (sender_id <> receiver_id)
);

-- =========================
-- Enable RLS
-- =========================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =========================
-- RLS POLICIES
-- =========================

-- Sender or receiver can read messages
CREATE POLICY "participants read messages"
  ON messages
  FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
  );

-- Sender inserts message
CREATE POLICY "sender inserts message"
  ON messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
  );

-- Sender can edit their own message (soft edit)
CREATE POLICY "sender updates message"
  ON messages
  FOR UPDATE
  USING (
    auth.uid() = sender_id
  )
  WITH CHECK (
    auth.uid() = sender_id
  );

-- =========================
-- INDEXES
-- =========================

-- Conversation history (chat view)
CREATE INDEX idx_messages_conversation_created
  ON messages (conversation_id, created_at DESC);

-- Inbox / analytics
CREATE INDEX idx_messages_sender_receiver
  ON messages (sender_id, receiver_id, created_at DESC);

-- Unread messages
CREATE INDEX idx_messages_unread
  ON messages (receiver_id)
  WHERE read_at IS NULL;

-- =========================
-- TRIGGER: update conversation last_message*
-- =========================
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_id = NEW.id,
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_inserted
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();

-- =========================
-- VIEW: last message per conversation (for inbox list)
-- =========================
CREATE VIEW public.conversation_last_messages AS
SELECT DISTINCT ON (m.conversation_id)
  m.conversation_id,
  m.id AS message_id,
  m.sender_id,
  m.receiver_id,
  m.content,
  m.created_at
FROM messages m
WHERE m.deleted_at IS NULL
ORDER BY m.conversation_id, m.created_at DESC;
