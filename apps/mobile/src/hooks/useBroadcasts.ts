import { useState, useEffect } from 'react';
import { BroadcastWithDetails, calculateExpiration, isBroadcastActive } from '@vicin/shared';
import { useAuth } from '../context/AuthContext';
import { supabase, isMockMode } from '../lib/supabase';
import { useGroup } from './useGroup';

const INITIAL_MOCK_BROADCASTS: BroadcastWithDetails[] = [
  {
    id: 'bc-sample-1',
    user_id: '22222222-2222-2222-2222-222222222222',
    group_id: 'group-village',
    activity_id: 'act-coffee',
    message: 'At Joe Coffee on the corner, working on laptop for a bit!',
    expires_at: calculateExpiration(45),
    status: 'active',
    created_at: new Date().toISOString(),
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'bob@vicin.app',
      name: 'Bob Martinez',
      auth_provider: 'google',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    activity: {
      id: 'act-coffee',
      group_id: 'group-village',
      name: 'Coffee Break',
      emoji: '☕',
      default_duration_mins: 30,
      created_at: new Date().toISOString(),
    },
    group: {
      id: 'group-village',
      name: 'Greenwich Village Pod',
      created_by: '11111111-1111-1111-1111-111111111111',
      created_at: new Date().toISOString(),
    },
    acknowledgments: [
      {
        id: 'ack-1',
        broadcast_id: 'bc-sample-1',
        user_id: '11111111-1111-1111-1111-111111111111',
        created_at: new Date().toISOString(),
      },
    ],
    acknowledgment_count: 1,
    user_has_acknowledged: true,
  },
];

export function useBroadcasts(groupId?: string) {
  const { user } = useAuth();
  const { currentGroup, activities } = useGroup();
  const activeGroupId = groupId || currentGroup?.id;

  const [broadcasts, setBroadcasts] = useState<BroadcastWithDetails[]>(INITIAL_MOCK_BROADCASTS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isMockMode) {
      // Filter expired broadcasts every 15s
      const interval = setInterval(() => {
        setBroadcasts(prev => prev.filter(b => isBroadcastActive(b.expires_at)));
      }, 15000);
      return () => clearInterval(interval);
    }

    if (user && activeGroupId) {
      fetchBroadcasts();

      // Supabase Realtime subscription
      const channel = supabase
        .channel(`broadcasts:${activeGroupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'broadcasts',
            filter: `group_id=eq.${activeGroupId}`,
          },
          () => {
            fetchBroadcasts();
          }
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'acknowledgments' }, () => {
          fetchBroadcasts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, activeGroupId]);

  const fetchBroadcasts = async () => {
    if (!activeGroupId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('broadcasts')
        .select(
          `
          *,
          user:users(*),
          activity:activities(*),
          group:groups(*),
          acknowledgments(*, user:users(*))
        `
        )
        .eq('group_id', activeGroupId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (data && !error) {
        interface RawBroadcastResponse extends BroadcastWithDetails {
          acknowledgments: Array<{ user_id: string; [key: string]: unknown }>;
        }
        const enriched: BroadcastWithDetails[] = (data as unknown as RawBroadcastResponse[]).map(
          b => ({
            ...b,
            acknowledgment_count: b.acknowledgments?.length || 0,
            user_has_acknowledged: b.acknowledgments?.some(a => a.user_id === user?.id),
          })
        );
        setBroadcasts(enriched);
      }
    } catch (err) {
      console.error('Failed fetching broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBroadcast = async ({
    activityId,
    durationMins,
    message,
  }: {
    activityId: string;
    durationMins: number;
    message?: string;
  }) => {
    if (!user || !activeGroupId) return null;

    const expiresAt = calculateExpiration(durationMins);
    const selectedAct = activities.find(a => a.id === activityId) || {
      id: activityId,
      group_id: activeGroupId,
      name: 'Available',
      emoji: '⚡',
      default_duration_mins: durationMins,
      created_at: new Date().toISOString(),
    };

    const newBroadcast: BroadcastWithDetails = {
      id: `bc-${Date.now()}`,
      user_id: user.id,
      group_id: activeGroupId,
      activity_id: activityId,
      message: message || null,
      expires_at: expiresAt,
      status: 'active',
      created_at: new Date().toISOString(),
      user,
      activity: selectedAct,
      group: currentGroup,
      acknowledgments: [],
      acknowledgment_count: 0,
      user_has_acknowledged: false,
    };

    // Optimistic UI update
    setBroadcasts(prev => [newBroadcast, ...prev]);

    if (!isMockMode) {
      await supabase.from('broadcasts').insert({
        group_id: activeGroupId,
        user_id: user.id,
        activity_id: activityId,
        message,
        expires_at: expiresAt,
      });
      await fetchBroadcasts();
    }

    return newBroadcast;
  };

  const toggleAcknowledgment = async (broadcastId: string) => {
    if (!user) return;

    // Optimistic toggle
    setBroadcasts(prev =>
      prev.map(b => {
        if (b.id !== broadcastId) return b;
        const hasAck = b.user_has_acknowledged;
        const newCount = hasAck ? b.acknowledgment_count - 1 : b.acknowledgment_count + 1;
        const newAcks = hasAck
          ? b.acknowledgments.filter(a => a.user_id !== user.id)
          : [
              ...b.acknowledgments,
              {
                id: `ack-${Date.now()}`,
                broadcast_id: broadcastId,
                user_id: user.id,
                created_at: new Date().toISOString(),
                user,
              },
            ];

        return {
          ...b,
          user_has_acknowledged: !hasAck,
          acknowledgment_count: Math.max(0, newCount),
          acknowledgments: newAcks,
        };
      })
    );

    if (!isMockMode) {
      const target = broadcasts.find(b => b.id === broadcastId);
      if (target?.user_has_acknowledged) {
        await supabase
          .from('acknowledgments')
          .delete()
          .eq('broadcast_id', broadcastId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('acknowledgments')
          .insert({ broadcast_id: broadcastId, user_id: user.id });
      }
    }
  };

  const cancelBroadcast = async (broadcastId: string) => {
    setBroadcasts(prev => prev.filter(b => b.id !== broadcastId));
    if (!isMockMode) {
      await supabase.from('broadcasts').update({ status: 'cancelled' }).eq('id', broadcastId);
    }
  };

  return {
    broadcasts: broadcasts.filter(b => isBroadcastActive(b.expires_at) && b.status === 'active'),
    loading,
    createBroadcast,
    toggleAcknowledgment,
    cancelBroadcast,
    refetch: fetchBroadcasts,
  };
}
