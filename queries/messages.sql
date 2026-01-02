-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Sender or receiver can read
CREATE POLICY "participants read messages"
  ON messages
  FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
  );

-- Sender inserts
CREATE POLICY "sender inserts message"
  ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Indexes
CREATE INDEX idx_messages_sender_receiver
  ON messages (sender_id, receiver_id, created_at);
