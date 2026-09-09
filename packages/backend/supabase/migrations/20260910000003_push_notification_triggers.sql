-- Vicin Database Migration 0003: Push Notification Triggers & Webhook Dispatches
-- Dispatches notifications on new Broadcast or Acknowledgment events,
-- respecting member's push_enabled preferences and filtering out author.

CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Notification Event Queue Table (in case offline or asynchronous delivery is preferred)
CREATE TABLE IF NOT EXISTS public.push_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_queue_status ON public.push_queue(status, created_at);

-- Trigger function: Dispatch on New Broadcast
CREATE OR REPLACE FUNCTION public.handle_new_broadcast()
RETURNS TRIGGER AS $$
DECLARE
  author_name TEXT;
  group_name TEXT;
  activity_name TEXT;
  activity_emoji TEXT;
  member_record RECORD;
BEGIN
  -- Get author, group, and activity metadata
  SELECT name INTO author_name FROM public.users WHERE id = NEW.user_id;
  SELECT name INTO group_name FROM public.groups WHERE id = NEW.group_id;
  SELECT name, emoji INTO activity_name, activity_emoji FROM public.activities WHERE id = NEW.activity_id;

  -- Default values if null
  author_name := COALESCE(author_name, 'A neighbor');
  group_name := COALESCE(group_name, 'your group');
  activity_name := COALESCE(activity_name, 'Available now');
  activity_emoji := COALESCE(activity_emoji, '⚡');

  -- Enqueue push for every eligible group member with push_enabled = TRUE
  FOR member_record IN
    SELECT gm.user_id, u.expo_push_token
    FROM public.group_members gm
    JOIN public.users u ON gm.user_id = u.id
    WHERE gm.group_id = NEW.group_id
      AND gm.user_id <> NEW.user_id
      AND gm.push_enabled = TRUE
      AND u.expo_push_token IS NOT NULL
      AND u.expo_push_token <> ''
  LOOP
    INSERT INTO public.push_queue (recipient_user_id, title, body, data)
    VALUES (
      member_record.user_id,
      group_name,
      author_name || ' is available: ' || activity_emoji || ' ' || activity_name || (CASE WHEN NEW.message IS NOT NULL AND NEW.message <> '' THEN ' - "' || NEW.message || '"' ELSE '' END),
      jsonb_build_object(
        'type', 'new_broadcast',
        'broadcast_id', NEW.id,
        'group_id', NEW.group_id,
        'expires_at', NEW.expires_at
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function: Dispatch on New Acknowledgment ("I'm In")
CREATE OR REPLACE FUNCTION public.handle_new_acknowledgment()
RETURNS TRIGGER AS $$
DECLARE
  broadcaster_id UUID;
  broadcaster_token TEXT;
  group_id UUID;
  reactor_name TEXT;
  activity_emoji TEXT;
BEGIN
  -- Find broadcast owner and group
  SELECT b.user_id, b.group_id, a.emoji
  INTO broadcaster_id, group_id, activity_emoji
  FROM public.broadcasts b
  JOIN public.activities a ON b.activity_id = a.id
  WHERE b.id = NEW.broadcast_id;

  -- Don't notify if self-acknowledging
  IF broadcaster_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get reactor name
  SELECT name INTO reactor_name FROM public.users WHERE id = NEW.user_id;
  reactor_name := COALESCE(reactor_name, 'A member');
  activity_emoji := COALESCE(activity_emoji, '⚡');

  -- Get broadcaster push token
  SELECT expo_push_token INTO broadcaster_token FROM public.users WHERE id = broadcaster_id;

  IF broadcaster_token IS NOT NULL AND broadcaster_token <> '' THEN
    INSERT INTO public.push_queue (recipient_user_id, title, body, data)
    VALUES (
      broadcaster_id,
      activity_emoji || ' ' || reactor_name || ' is in!',
      reactor_name || ' just joined your broadcast!',
      jsonb_build_object(
        'type', 'new_acknowledgment',
        'broadcast_id', NEW.broadcast_id,
        'group_id', group_id,
        'user_id', NEW.user_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach triggers
DROP TRIGGER IF EXISTS tr_on_new_broadcast ON public.broadcasts;
CREATE TRIGGER tr_on_new_broadcast
  AFTER INSERT ON public.broadcasts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_broadcast();

DROP TRIGGER IF EXISTS tr_on_new_acknowledgment ON public.acknowledgments;
CREATE TRIGGER tr_on_new_acknowledgment
  AFTER INSERT ON public.acknowledgments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_acknowledgment();
