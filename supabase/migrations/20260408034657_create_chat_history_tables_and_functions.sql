/*
  # Create Chat History Tables and RPC Functions

  ## Summary
  Creates the database structure for persisting AI Chief of Staff chat conversations.

  ## New Tables

  ### chat_conversations
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to auth.users)
  - `title` (text) — first 60 chars of the opening message
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### chat_messages
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, FK to chat_conversations)
  - `role` (text) — 'user' or 'assistant'
  - `content` (text)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Users can only access their own conversations and messages

  ## RPC Functions
  - `get_chat_conversations()` — list conversations for current user
  - `create_chat_conversation(p_title)` — create new conversation, returns id
  - `save_chat_message(p_conversation_id, p_role, p_content)` — insert message
  - `get_chat_messages(p_conversation_id)` — get messages for a conversation
  - `delete_chat_conversation(p_conversation_id)` — delete conversation + messages
*/

-- Tables

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Indexes

CREATE INDEX IF NOT EXISTS chat_conversations_user_id_idx ON chat_conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_conversation_id_idx ON chat_messages(conversation_id, created_at ASC);

-- RLS

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON chat_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own conversations"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in own conversations"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()
    )
  );

-- RPC Functions

CREATE OR REPLACE FUNCTION get_chat_conversations()
RETURNS TABLE (id uuid, title text, updated_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, title, updated_at
  FROM chat_conversations
  WHERE user_id = auth.uid()
  ORDER BY updated_at DESC
  LIMIT 50;
$$;

CREATE OR REPLACE FUNCTION create_chat_conversation(p_title text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO chat_conversations (user_id, title)
  VALUES (auth.uid(), p_title)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION save_chat_message(
  p_conversation_id uuid,
  p_role text,
  p_content text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE id = p_conversation_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Conversation not found or access denied';
  END IF;

  INSERT INTO chat_messages (conversation_id, role, content)
  VALUES (p_conversation_id, p_role, p_content)
  RETURNING id INTO v_id;

  UPDATE chat_conversations
  SET updated_at = now()
  WHERE id = p_conversation_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_chat_messages(p_conversation_id uuid)
RETURNS TABLE (id uuid, role text, content text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE id = p_conversation_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Conversation not found or access denied';
  END IF;

  RETURN QUERY
    SELECT m.id, m.role, m.content, m.created_at
    FROM chat_messages m
    WHERE m.conversation_id = p_conversation_id
    ORDER BY m.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION delete_chat_conversation(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM chat_conversations
  WHERE id = p_conversation_id AND user_id = auth.uid();
END;
$$;
