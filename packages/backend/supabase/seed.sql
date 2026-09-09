-- Vicin Local Development Seed Data
-- Creates sample users, closed groups, activities, broadcasts, and acknowledgments.

-- 1. Insert Mock Users
INSERT INTO public.users (id, email, auth_provider, name, avatar_url, expo_push_token)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@vicin.app', 'email', 'Alice Chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'ExponentPushToken[mock_alice_token]'),
  ('22222222-2222-2222-2222-222222222222', 'bob@vicin.app', 'google', 'Bob Martinez', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'ExponentPushToken[mock_bob_token]'),
  ('33333333-3333-3333-3333-333333333333', 'charlie@vicin.app', 'apple', 'Charlie Davis', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'ExponentPushToken[mock_charlie_token]'),
  ('44444444-4444-4444-4444-444444444444', 'diana@vicin.app', 'email', 'Diana Prince', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert Groups
INSERT INTO public.groups (id, name, description, created_by)
VALUES
  ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Greenwich Village Pod', 'Neighbors on 10th & Bleeker Street', '11111111-1111-1111-1111-111111111111'),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', 'Westside Lofts Co-working', 'Residents building things together in the lounge', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Memberships
INSERT INTO public.group_members (group_id, user_id, role, push_enabled)
VALUES
  -- Greenwich Pod
  ('aaaa1111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'owner', TRUE),
  ('aaaa1111-aaaa-1111-aaaa-111111111111', '22222222-2222-2222-2222-222222222222', 'admin', TRUE),
  ('aaaa1111-aaaa-1111-aaaa-111111111111', '33333333-3333-3333-3333-333333333333', 'member', TRUE),
  -- Westside Lofts
  ('bbbb2222-bbbb-2222-bbbb-222222222222', '22222222-2222-2222-2222-222222222222', 'owner', TRUE),
  ('bbbb2222-bbbb-2222-bbbb-222222222222', '44444444-4444-4444-4444-444444444444', 'member', FALSE)
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 4. Insert Default Activities
INSERT INTO public.activities (id, group_id, name, emoji, default_duration_mins)
VALUES
  ('c0ffee01-0000-0000-0000-000000000001', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Coffee Break', '☕', 30),
  ('c0ffee02-0000-0000-0000-000000000002', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Dog Walk', '🐕', 45),
  ('c0ffee03-0000-0000-0000-000000000003', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Quick Lunch', '🍕', 60),
  ('c0ffee04-0000-0000-0000-000000000004', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Lounge Co-working', '💻', 120),
  ('c0ffee05-0000-0000-0000-000000000005', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Evening Padel', '🎾', 90)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Active Broadcasts
INSERT INTO public.broadcasts (id, user_id, group_id, activity_id, message, expires_at, status)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'c0ffee01-0000-0000-0000-000000000001',
    'At Joe Coffee on the corner, working on laptop for a bit!',
    NOW() + INTERVAL '45 minutes',
    'active'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'c0ffee02-0000-0000-0000-000000000002',
    'Taking Milo to Washington Square dog run.',
    NOW() + INTERVAL '25 minutes',
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Acknowledgments ("I'm in")
INSERT INTO public.acknowledgments (id, broadcast_id, user_id)
VALUES
  (
    'ac000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222'
  )
ON CONFLICT (id) DO NOTHING;
