import { useState, useEffect } from 'react';
import { Group, GroupMember, Activity } from '@vicin/shared';
import { useAuth } from '../context/AuthContext';
import { supabase, isMockMode } from '../lib/supabase';

// Mock initial data for local development & previews
const INITIAL_MOCK_GROUPS: Group[] = [
  {
    id: 'group-village',
    name: 'Greenwich Village Pod',
    description: 'Neighbors on 10th & Bleeker Street',
    created_by: '11111111-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
  },
  {
    id: 'group-westside',
    name: 'Westside Lofts Co-working',
    description: 'Residents building things together in the lounge',
    created_by: '22222222-2222-2222-2222-222222222222',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-coffee',
    group_id: 'group-village',
    name: 'Coffee Break',
    emoji: '☕',
    default_duration_mins: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: 'act-walk',
    group_id: 'group-village',
    name: 'Dog Walk / Stroll',
    emoji: '🐕',
    default_duration_mins: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: 'act-lunch',
    group_id: 'group-village',
    name: 'Quick Lunch',
    emoji: '🍕',
    default_duration_mins: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: 'act-cowork',
    group_id: 'group-westside',
    name: 'Lounge Co-working',
    emoji: '💻',
    default_duration_mins: 120,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_MOCK_MEMBERS: GroupMember[] = [
  {
    group_id: 'group-village',
    user_id: '11111111-1111-1111-1111-111111111111',
    role: 'owner',
    push_enabled: true,
    joined_at: new Date().toISOString(),
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Alice Chen',
      email: 'alice@vicin.app',
      auth_provider: 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    group_id: 'group-village',
    user_id: '22222222-2222-2222-2222-222222222222',
    role: 'admin',
    push_enabled: true,
    joined_at: new Date().toISOString(),
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Bob Martinez',
      email: 'bob@vicin.app',
      auth_provider: 'google',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export function useGroup() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(INITIAL_MOCK_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(INITIAL_MOCK_GROUPS[0].id);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_MOCK_ACTIVITIES);
  const [members, setMembers] = useState<GroupMember[]>(INITIAL_MOCK_MEMBERS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isMockMode && user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setGroups(data);
        if (data.length > 0 && !selectedGroupId) {
          setSelectedGroupId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const groupActivities = activities.filter(a => a.group_id === selectedGroupId);
  const groupMembers = members.filter(m => m.group_id === selectedGroupId);

  const createGroup = async (name: string, description?: string) => {
    if (!user) return null;
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description: description || null,
      created_by: user.id,
      created_at: new Date().toISOString(),
    };

    if (isMockMode) {
      setGroups(prev => [newGroup, ...prev]);
      setSelectedGroupId(newGroup.id);

      // Add default activity
      const defaultAct: Activity = {
        id: `act-${Date.now()}`,
        group_id: newGroup.id,
        name: 'Coffee / Hangout',
        emoji: '☕',
        default_duration_mins: 45,
        created_at: new Date().toISOString(),
      };
      setActivities(prev => [...prev, defaultAct]);

      // Add user as owner
      const newMember: GroupMember = {
        group_id: newGroup.id,
        user_id: user.id,
        role: 'owner',
        push_enabled: true,
        joined_at: new Date().toISOString(),
        user,
      };
      setMembers(prev => [...prev, newMember]);
      return newGroup;
    }

    const { data, error } = await supabase
      .from('groups')
      .insert({ name, description, created_by: user.id })
      .select()
      .single();

    if (!error && data) {
      await fetchGroups();
      return data;
    }
    return null;
  };

  const createInvite = async (groupId: string): Promise<string> => {
    const token = `inv_${Math.random().toString(36).substring(2, 10)}`;
    const deepLink = `vicin://invite/${token}`;

    if (!isMockMode && user) {
      await supabase.from('group_invites').insert({
        group_id: groupId,
        token,
        created_by: user.id,
      });
    }

    return deepLink;
  };

  const acceptInvite = async (
    token: string
  ): Promise<{ success: boolean; groupName?: string; error?: string }> => {
    if (!user) return { success: false, error: 'User must be authenticated' };

    if (isMockMode) {
      const targetGroup = groups[0];
      const alreadyMember = members.some(
        m => m.group_id === targetGroup.id && m.user_id === user.id
      );
      if (!alreadyMember) {
        const newMember: GroupMember = {
          group_id: targetGroup.id,
          user_id: user.id,
          role: 'member',
          push_enabled: true,
          joined_at: new Date().toISOString(),
          user,
        };
        setMembers(prev => [...prev, newMember]);
      }
      return { success: true, groupName: targetGroup.name };
    }

    // Live Supabase invite acceptance
    const { data: invite, error } = await supabase
      .from('group_invites')
      .select('group_id, status, groups(name)')
      .eq('token', token)
      .single();

    if (error || !invite) {
      return { success: false, error: 'Invalid or expired invite token' };
    }

    await supabase.from('group_members').insert({
      group_id: invite.group_id,
      user_id: user.id,
      role: 'member',
    });

    await fetchGroups();
    const groupData = invite.groups as unknown as { name?: string };
    return { success: true, groupName: groupData?.name };
  };

  const addActivity = async (
    groupId: string,
    name: string,
    emoji: string,
    durationMins: number
  ) => {
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      group_id: groupId,
      name,
      emoji: emoji || '⚡',
      default_duration_mins: durationMins || 60,
      created_at: new Date().toISOString(),
    };

    if (isMockMode) {
      setActivities(prev => [...prev, newAct]);
      return newAct;
    }

    const { data } = await supabase
      .from('activities')
      .insert({
        group_id: groupId,
        name,
        emoji,
        default_duration_mins: durationMins,
      })
      .select()
      .single();

    if (data) {
      setActivities(prev => [...prev, data]);
      return data;
    }
    return newAct;
  };

  const deleteActivity = async (activityId: string) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
    if (!isMockMode) {
      await supabase.from('activities').delete().eq('id', activityId);
    }
  };

  const togglePush = async (groupId: string, enabled: boolean) => {
    setMembers(prev =>
      prev.map(m =>
        m.group_id === groupId && m.user_id === user?.id ? { ...m, push_enabled: enabled } : m
      )
    );

    if (!isMockMode && user) {
      await supabase
        .from('group_members')
        .update({ push_enabled: enabled })
        .eq('group_id', groupId)
        .eq('user_id', user.id);
    }
  };

  const leaveGroup = async (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setMembers(prev => prev.filter(m => !(m.group_id === groupId && m.user_id === user?.id)));
    if (!isMockMode && user) {
      await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', user.id);
      await fetchGroups();
    }
  };

  const removeMember = async (groupId: string, userId: string) => {
    setMembers(prev => prev.filter(m => !(m.group_id === groupId && m.user_id === userId)));
    if (!isMockMode) {
      await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
    }
  };

  return {
    groups,
    currentGroup,
    selectedGroupId,
    setSelectedGroupId,
    activities: groupActivities,
    allActivities: activities,
    members: groupMembers,
    loading,
    createGroup,
    createInvite,
    acceptInvite,
    addActivity,
    deleteActivity,
    togglePush,
    leaveGroup,
    removeMember,
  };
}
