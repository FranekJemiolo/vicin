import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useGroup } from '../../hooks/useGroup';
import { useBroadcasts } from '../../hooks/useBroadcasts';
import { BroadcastCard } from '../../components/BroadcastCard';
import { FeedSkeletonLoader } from '../../components/FeedSkeletonLoader';

export const FeedScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { groups, currentGroup, selectedGroupId, setSelectedGroupId } = useGroup();
  const { broadcasts, loading, toggleAcknowledgment, cancelBroadcast, refetch } =
    useBroadcasts(selectedGroupId);

  return (
    <SafeAreaView className="flex-1 bg-[#090A0F]">
      {/* Top Header */}
      <View className="px-5 pt-4 pb-3 border-b border-white/5">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-[11px] font-semibold text-emerald-400 tracking-widest uppercase">
              Vicin Pulse
            </Text>
            <Text className="text-2xl font-bold text-white tracking-tight">
              Active Availability
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateBroadcastModal', { groupId: selectedGroupId })
            }
            className="bg-emerald-500 active:bg-emerald-600 px-4 py-2.5 rounded-xl flex-row items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Text className="text-white font-bold text-xs">+ Broadcast</Text>
          </TouchableOpacity>
        </View>

        {/* Group Selector Pills */}
        {groups.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2 py-1"
          >
            {groups.map(g => {
              const isSelected = g.id === selectedGroupId;
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setSelectedGroupId(g.id)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/40'
                      : 'bg-[#12141C] border-white/10'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {g.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Feed Content */}
      <ScrollView
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#10B981" />
        }
      >
        {loading && broadcasts.length === 0 ? (
          <FeedSkeletonLoader />
        ) : broadcasts.length > 0 ? (
          broadcasts.map(bc => (
            <BroadcastCard
              key={bc.id}
              broadcast={bc}
              onToggleAcknowledge={toggleAcknowledgment}
              onCancel={cancelBroadcast}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-16 text-center">
            <View className="w-20 h-20 rounded-full bg-[#12141C] border border-white/10 items-center justify-center mb-5 shadow-2xl">
              <Text className="text-3xl">☕</Text>
            </View>
            <Text className="text-xl font-bold text-white mb-2">Neighborhood is quiet</Text>
            <Text className="text-slate-400 text-xs text-center max-w-xs mb-6 leading-relaxed">
              No active broadcasts in {currentGroup?.name || 'this circle'}. Be the first to let
              your trusted circle know you're free!
            </Text>

            <View className="w-full max-w-xs space-y-3">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CreateBroadcastModal', { groupId: selectedGroupId })
                }
                className="w-full bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center shadow-lg shadow-emerald-500/25"
              >
                <Text className="text-white font-bold text-xs tracking-wide">
                  + Broadcast Your Availability
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('GroupSettingsModal', { groupId: selectedGroupId })
                }
                className="w-full bg-[#12141C] border border-white/10 py-3 rounded-xl items-center mt-2"
              >
                <Text className="text-slate-300 font-semibold text-xs">+ Invite Neighbors</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
