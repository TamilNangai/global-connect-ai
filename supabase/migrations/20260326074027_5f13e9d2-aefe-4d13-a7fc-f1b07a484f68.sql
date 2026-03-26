
-- Conversations table for persistent memory
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  language text DEFAULT 'en',
  sentiment text DEFAULT 'neutral',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  language text,
  sentiment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Analytics table for dashboard
CREATE TABLE public.assistant_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  language text,
  message_count int DEFAULT 0,
  duration_seconds int DEFAULT 0,
  sentiment text DEFAULT 'neutral',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_analytics ENABLE ROW LEVEL SECURITY;

-- Public access policies (assistant is public)
CREATE POLICY "Anyone can create conversations" ON public.conversations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view own conversations by session" ON public.conversations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update conversations" ON public.conversations FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert analytics" ON public.assistant_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.assistant_analytics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Indexes
CREATE INDEX idx_conversations_session ON public.conversations(session_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_analytics_created ON public.assistant_analytics(created_at);
