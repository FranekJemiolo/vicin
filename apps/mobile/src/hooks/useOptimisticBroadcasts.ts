import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BroadcastWithDetails, calculateExpiration, isBroadcastActive } from '@vicin/shared';
import { useAuth } from '../context/AuthContext';
import { supabase, isMockMode } from '../lib/supabase';
import { useGroup } from './useGroup';

export const BROADCASTS_QUERY_KEY = 'broadcasts';

export function useOptimisticBroadcasts(groupId?: string) {
  const { user } = useAuth();
  const { currentGroup, activities } = useGroup();
  const queryClient = useQueryClient();
  const activeGroupId = groupId || currentGroup?.id;

  // 1. Query for active broadcasts
  const {
    data: broadcasts = [],
    isLoading,
    refetch,
  } = useQuery<BroadcastWithDetails[]>({
    queryKey: [BROADCASTS_QUERY_KEY, activeGroupId],
    queryFn: async () => {
      if (!activeGroupId) return [];

      if (isMockMode) {
        return [
          {
            id: 'bc-sample-1',
            user_id: '22222222-2222-2222-2222-222222222222',
            group_id: activeGroupId,
            activity_id: 'act-coffee',
            message: 'At Joe Coffee on the corner, laptop out!',
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
              group_id: activeGroupId,
              name: 'Coffee Break',
              emoji: '☕',
              default_duration_mins: 30,
              created_at: new Date().toISOString(),
            },
            group: currentGroup,
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
      }

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

      if (error || !data) return [];

      type RawResponse = Omit<
        BroadcastWithDetails,
        'acknowledgment_count' | 'user_has_acknowledged'
      >;
      return (data as unknown as RawResponse[]).map(b => ({
        ...b,
        acknowledgment_count: b.acknowledgments?.length || 0,
        user_has_acknowledged: b.acknowledgments?.some(a => a.user_id === user?.id) || false,
      }));
    },
    staleTime: 5000,
  });

  // 2. Optimistic Mutation: Create Broadcast
  const createMutation = useMutation({
    mutationFn: async ({
      activityId,
      durationMins,
      message,
    }: {
      activityId: string;
      durationMins: number;
      message?: string;
    }) => {
      if (!user || !activeGroupId) throw new Error('Unauthenticated or no active group');
      const expiresAt = calculateExpiration(durationMins);

      if (isMockMode) {
        return { success: true };
      }

      const { data, error } = await supabase
        .from('broadcasts')
        .insert({
          group_id: activeGroupId,
          user_id: user.id,
          activity_id: activityId,
          message,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async newBroadcastInput => {
      await queryClient.cancelQueries({ queryKey: [BROADCASTS_QUERY_KEY, activeGroupId] });
      const previousBroadcasts =
        queryClient.getQueryData<BroadcastWithDetails[]>([BROADCASTS_QUERY_KEY, activeGroupId]) ||
        [];

      if (user && activeGroupId) {
        const selectedAct = activities.find(a => a.id === newBroadcastInput.activityId) || {
          id: newBroadcastInput.activityId,
          group_id: activeGroupId,
          name: 'Available',
          emoji: '⚡',
          default_duration_mins: newBroadcastInput.durationMins,
          created_at: new Date().toISOString(),
        };

        const optimisticBroadcast: BroadcastWithDetails = {
          id: `temp-${Date.now()}`,
          user_id: user.id,
          group_id: activeGroupId,
          activity_id: newBroadcastInput.activityId,
          message: newBroadcastInput.message || null,
          expires_at: calculateExpiration(newBroadcastInput.durationMins),
          status: 'active',
          created_at: new Date().toISOString(),
          user,
          activity: selectedAct,
          group: currentGroup,
          acknowledgments: [],
          acknowledgment_count: 0,
          user_has_acknowledged: false,
        };

        queryClient.setQueryData<BroadcastWithDetails[]>(
          [BROADCASTS_QUERY_KEY, activeGroupId],
          [optimisticBroadcast, ...previousBroadcasts]
        );
      }

      return { previousBroadcasts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBroadcasts) {
        queryClient.setQueryData([BROADCASTS_QUERY_KEY, activeGroupId], context.previousBroadcasts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BROADCASTS_QUERY_KEY, activeGroupId] });
    },
  });

  // 3. Optimistic Mutation: Acknowledge ("I'm In")
  const acknowledgeMutation = useMutation({
    mutationFn: async (broadcastId: string) => {
      if (!user) throw new Error('Unauthenticated');
      if (isMockMode) return { success: true };

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
    },
    onMutate: async broadcastId => {
      await queryClient.cancelQueries({ queryKey: [BROADCASTS_QUERY_KEY, activeGroupId] });
      const previousBroadcasts =
        queryClient.getQueryData<BroadcastWithDetails[]>([BROADCASTS_QUERY_KEY, activeGroupId]) ||
        [];

      if (user) {
        queryClient.setQueryData<BroadcastWithDetails[]>(
          [BROADCASTS_QUERY_KEY, activeGroupId],
          previousBroadcasts.map(b => {
            if (b.id !== broadcastId) return b;
            const hasAcked = b.user_has_acknowledged;
            const newCount = hasAcked ? b.acknowledgment_count - 1 : b.acknowledgment_count + 1;
            return {
              ...b,
              user_has_acknowledged: !hasAcked,
              acknowledgment_count: Math.max(0, newCount),
            };
          })
        );
      }

      return { previousBroadcasts };
    },
    onError: (_err, _broadcastId, context) => {
      if (context?.previousBroadcasts) {
        queryClient.setQueryData([BROADCASTS_QUERY_KEY, activeGroupId], context.previousBroadcasts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BROADCASTS_QUERY_KEY, activeGroupId] });
    },
  });

  return {
    broadcasts: broadcasts.filter(b => isBroadcastActive(b.expires_at) && b.status === 'active'),
    isLoading,
    refetch,
    createBroadcast: createMutation.mutateAsync,
    toggleAcknowledgment: acknowledgeMutation.mutate,
  };
}
