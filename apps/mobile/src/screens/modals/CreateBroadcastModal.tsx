import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useGroup } from '../../hooks/useGroup';
import { useBroadcasts } from '../../hooks/useBroadcasts';

type RouteProps = RouteProp<RootStackParamList, 'CreateBroadcastModal'>;

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

export const CreateBroadcastModal: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { currentGroup, activities } = useGroup();
  const { createBroadcast } = useBroadcasts(route.params?.groupId || currentGroup?.id);

  const [selectedActivityId, setSelectedActivityId] = useState<string>(activities[0]?.id || '');
  const [durationMins, setDurationMins] = useState<number>(
    activities[0]?.default_duration_mins || 45
  );
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivitySelect = (actId: string) => {
    setSelectedActivityId(actId);
    const act = activities.find(a => a.id === actId);
    if (act) {
      setDurationMins(act.default_duration_mins);
    }
  };

  const handleBroadcast = async () => {
    if (!selectedActivityId) return;
    setLoading(true);
    await createBroadcast({
      activityId: selectedActivityId,
      durationMins,
      message: message.trim() || undefined,
    });
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#090A0F] pt-8">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4 border-b border-white/10">
        <View>
          <Text className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            {currentGroup?.name || 'Your Circle'}
          </Text>
          <Text className="text-2xl font-bold text-white tracking-tight">
            Broadcast Availability
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 px-3">
          <Text className="text-slate-400 text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* 1. Pick Activity */}
        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          1. What are you up for?
        </Text>
        <View className="flex-row flex-wrap gap-2.5 mb-6">
          {activities.map(act => {
            const isSelected = selectedActivityId === act.id;
            return (
              <TouchableOpacity
                key={act.id}
                onPress={() => handleActivitySelect(act.id)}
                className={`flex-row items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white'
                    : 'bg-[#12141C] border-white/10'
                }`}
              >
                <Text className="text-xl">{act.emoji}</Text>
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-emerald-300' : 'text-slate-300'
                  }`}
                >
                  {act.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 2. Duration Preset */}
        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          2. How long are you free?
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {DURATION_PRESETS.map(d => {
            const isSelected = durationMins === d;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setDurationMins(d)}
                className={`px-4 py-2.5 rounded-xl border ${
                  isSelected ? 'bg-emerald-500 border-emerald-400' : 'bg-[#12141C] border-white/10'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {d < 60 ? `${d}m` : `${d / 60}h`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Optional Note */}
        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          3. Note (Optional)
        </Text>
        <TextInput
          className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3 text-white text-xs mb-8"
          placeholder="e.g. Corner table with laptop, bringing dog..."
          placeholderTextColor="#64748B"
          value={message}
          onChangeText={setMessage}
        />

        {/* CTA */}
        <TouchableOpacity
          onPress={handleBroadcast}
          disabled={loading || !selectedActivityId}
          className="w-full bg-emerald-500 active:bg-emerald-600 rounded-2xl py-4 items-center justify-center shadow-lg shadow-emerald-500/25"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-sm tracking-wide">
              Broadcast Availability Now
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
