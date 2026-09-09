import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export const FeedScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-[#090A0F] px-5 pt-14">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Neighborhood Pulse
          </Text>
          <Text className="text-2xl font-bold text-white tracking-tight">Active Feed</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBroadcastModal', {})}
          className="bg-emerald-500 active:bg-emerald-600 px-3.5 py-2 rounded-xl flex-row items-center gap-1.5"
        >
          <Text className="text-white font-semibold text-xs">+ Broadcast</Text>
        </TouchableOpacity>
      </View>

      {/* Feed Empty or Active state container */}
      <View className="flex-1 items-center justify-center p-6 text-center">
        <View className="w-16 h-16 rounded-full bg-[#12141C] border border-white/10 items-center justify-center mb-4">
          <Text className="text-2xl">☕</Text>
        </View>
        <Text className="text-lg font-semibold text-white mb-2">No active broadcasts yet</Text>
        <Text className="text-slate-400 text-xs text-center max-w-xs mb-6">
          Hey {user?.name || 'there'}! Be the first to let your neighbors know you're free for a
          walk, coffee, or quick chat.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBroadcastModal', {})}
          className="bg-[#12141C] border border-emerald-500/30 px-5 py-3 rounded-xl"
        >
          <Text className="text-emerald-400 font-medium text-xs">Start a 1-Hour Broadcast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
