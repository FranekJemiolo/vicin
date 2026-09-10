import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { BroadcastWithDetails, formatCountdown } from '@vicin/shared';
import { useAuth } from '../context/AuthContext';

interface BroadcastCardProps {
  broadcast: BroadcastWithDetails;
  onToggleAcknowledge: (broadcastId: string) => void;
  onCancel?: (broadcastId: string) => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({
  broadcast,
  onToggleAcknowledge,
  onCancel,
}) => {
  const { user } = useAuth();
  const isAuthor = user?.id === broadcast.user_id;
  const countdown = formatCountdown(broadcast.expires_at);

  return (
    <View className="bg-[#12141C] border border-white/10 rounded-3xl p-5 mb-4 shadow-xl">
      {/* Top Header: Author + Countdown Badge */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          {broadcast.user?.avatar_url ? (
            <Image
              source={{ uri: broadcast.user.avatar_url }}
              className="w-10 h-10 rounded-full border border-white/10"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center">
              <Text className="text-emerald-400 font-bold text-sm">
                {broadcast.user?.name?.[0] || 'N'}
              </Text>
            </View>
          )}

          <View>
            <Text className="text-white font-semibold text-sm">
              {broadcast.user?.name || 'Neighbor'}
              {isAuthor ? ' (You)' : ''}
            </Text>
            <Text className="text-slate-400 text-[11px]">
              {broadcast.group?.name || 'Neighborhood Pod'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Text className="text-emerald-400 font-medium text-xs font-mono">{countdown}</Text>
        </View>
      </View>

      {/* Activity Callout */}
      <View className="bg-[#1A1D27]/80 border border-white/5 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center gap-3">
          <Text className="text-3xl">{broadcast.activity?.emoji || '⚡'}</Text>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">
              {broadcast.activity?.name || 'Spontaneous Availability'}
            </Text>
            {broadcast.message ? (
              <Text className="text-slate-300 text-xs mt-0.5">{broadcast.message}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Footer: Acknowledgment Action & Social Count */}
      <View className="flex-row items-center justify-between pt-2">
        <View className="flex-row items-center gap-2">
          {broadcast.acknowledgment_count > 0 ? (
            <View className="flex-row items-center gap-1.5">
              <View className="flex-row -space-x-1.5">
                {[...Array(Math.min(broadcast.acknowledgment_count, 3))].map((_, i) => (
                  <View
                    key={i}
                    className={`w-5 h-5 rounded-full border border-[#12141C] items-center justify-center ${
                      i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  >
                    <Text className="text-[9px] font-bold text-white">✓</Text>
                  </View>
                ))}
              </View>
              <Text className="text-xs text-slate-300 font-medium">
                {broadcast.acknowledgment_count}{' '}
                {broadcast.acknowledgment_count === 1 ? 'neighbor in' : 'neighbors in'}
              </Text>
            </View>
          ) : (
            <Text className="text-xs text-slate-500">Be the first to join</Text>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {isAuthor && onCancel ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onCancel(broadcast.id)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-rose-400 text-xs font-medium">Cancel</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onToggleAcknowledge(broadcast.id)}
            className={`px-4 py-2 rounded-xl border flex-row items-center gap-1.5 ${
              broadcast.user_has_acknowledged
                ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-[#1A1D27] border-white/15'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                broadcast.user_has_acknowledged ? 'text-white' : 'text-slate-200'
              }`}
            >
              {broadcast.user_has_acknowledged ? "✓ I'm In!" : "I'm in"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
