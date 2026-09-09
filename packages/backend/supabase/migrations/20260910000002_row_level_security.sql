-- Vicin Database Migration 0002: Row Level Security (RLS)
-- Enforces closed-loop tenant isolation for groups, broadcasts, and responses.

-- Helper function: Check group membership without recursion
CREATE OR REPLACE FUNCTION public.is_group_member(check_group_id UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = check_group_id AND user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Check if user is group admin or owner
CREATE OR REPLACE FUNCTION public.is_group_admin(check_group_id UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = check_group_id AND user_id = check_user_id AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acknowledgments ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 1. USERS POLICIES
-- =========================================================================
-- Authenticated users can view profile details of users in shared groups or themselves
CREATE POLICY "Users can view members of their groups or self" ON public.users
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = public.users.id
    )
  );

-- Users can only update their own user record
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can insert their own record upon registration
CREATE POLICY "Users can insert own record" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- =========================================================================
-- 2. GROUPS POLICIES
-- =========================================================================
-- Users can view groups they belong to
CREATE POLICY "Members can view their groups" ON public.groups
  FOR SELECT TO authenticated
  USING (public.is_group_member(id, auth.uid()));

-- Any authenticated user can create a new group
CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Only admins/owners can update group details
CREATE POLICY "Admins can update groups" ON public.groups
  FOR UPDATE TO authenticated
  USING (public.is_group_admin(id, auth.uid()))
  WITH CHECK (public.is_group_admin(id, auth.uid()));

-- Only owner can delete a group
CREATE POLICY "Owners can delete groups" ON public.groups
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- =========================================================================
-- 3. GROUP MEMBERS POLICIES
-- =========================================================================
-- Members can view members of their group
CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id, auth.uid()));

-- Users can add themselves when joining or group creator can add themselves as owner
CREATE POLICY "Users can join or creators add initial membership" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences (push_enabled) OR admins can update roles
CREATE POLICY "Users update own prefs or admins update roles" ON public.group_members
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_group_admin(group_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_group_admin(group_id, auth.uid()));

-- Users can voluntarily leave OR admins can remove members
CREATE POLICY "Users leave or admins remove members" ON public.group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_group_admin(group_id, auth.uid()));

-- =========================================================================
-- 4. GROUP INVITES POLICIES
-- =========================================================================
-- Group members can view active invites for their groups; any authenticated user can view invite by token
CREATE POLICY "Members view group invites or public token lookup" ON public.group_invites
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id, auth.uid()) OR status = 'pending');

-- Members can create invites for their group
CREATE POLICY "Members can create invites" ON public.group_invites
  FOR INSERT TO authenticated
  WITH CHECK (public.is_group_member(group_id, auth.uid()) AND created_by = auth.uid());

-- Accepting user can mark invite as accepted
CREATE POLICY "Users can accept invites" ON public.group_invites
  FOR UPDATE TO authenticated
  USING (status = 'pending')
  WITH CHECK (status = 'accepted');

-- =========================================================================
-- 5. ACTIVITIES POLICIES
-- =========================================================================
-- Members can view activities defined for their group
CREATE POLICY "Members can view group activities" ON public.activities
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id, auth.uid()));

-- Members can create activities for their group
CREATE POLICY "Members can create activities" ON public.activities
  FOR INSERT TO authenticated
  WITH CHECK (public.is_group_member(group_id, auth.uid()));

-- Admins can update/delete activities
CREATE POLICY "Admins can update activities" ON public.activities
  FOR UPDATE TO authenticated
  USING (public.is_group_admin(group_id, auth.uid()))
  WITH CHECK (public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Admins can delete activities" ON public.activities
  FOR DELETE TO authenticated
  USING (public.is_group_admin(group_id, auth.uid()));

-- =========================================================================
-- 6. BROADCASTS POLICIES (STRICT CROSS-GROUP ISOLATION)
-- =========================================================================
-- Members can ONLY view broadcasts belonging to their groups
CREATE POLICY "Members view group broadcasts" ON public.broadcasts
  FOR SELECT TO authenticated
  USING (public.is_group_member(group_id, auth.uid()));

-- Members can only create broadcasts in groups they belong to and for their own user_id
CREATE POLICY "Members can insert own broadcast in group" ON public.broadcasts
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    public.is_group_member(group_id, auth.uid())
  );

-- Users can only update or cancel their own broadcasts
CREATE POLICY "Authors can update own broadcasts" ON public.broadcasts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Authors can delete their own broadcast
CREATE POLICY "Authors can delete own broadcasts" ON public.broadcasts
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- =========================================================================
-- 7. ACKNOWLEDGMENTS POLICIES ("I'M IN")
-- =========================================================================
-- Members can view acknowledgments on broadcasts within their groups
CREATE POLICY "Members view broadcast acknowledgments" ON public.acknowledgments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.broadcasts b
      WHERE b.id = public.acknowledgments.broadcast_id
        AND public.is_group_member(b.group_id, auth.uid())
    )
  );

-- Members can only acknowledge for themselves in groups they belong to
CREATE POLICY "Members can acknowledge broadcasts" ON public.acknowledgments
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.broadcasts b
      WHERE b.id = public.acknowledgments.broadcast_id
        AND public.is_group_member(b.group_id, auth.uid())
        AND b.status = 'active'
        AND b.expires_at > NOW()
    )
  );

-- Users can revoke their own acknowledgment
CREATE POLICY "Users can remove own acknowledgment" ON public.acknowledgments
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
