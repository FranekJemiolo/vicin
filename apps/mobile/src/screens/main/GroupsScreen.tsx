import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-[#090A0F] px-5 pt-14">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Closed Loops
          </Text>
          <Text className="text-2xl font-bold text-white tracking-tight">Your Groups</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreateGroupModal')}
          className="bg-[#12141C] border border-white/10 px-3.5 py-2 rounded-xl"
        >
          <Text className="text-white font-medium text-xs">+ New Group</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-semibold text-base">Greenwich Village Pod</Text>
          <View className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            <Text className="text-emerald-400 text-[10px] font-semibold uppercase">Active</Text>
          </View>
        </View>
        <Text className="text-slate-400 text-xs mb-4">Neighbors on 10th & Bleeker Street</Text>

        <View className="flex-row items-center justify-between pt-3 border-t border-white/5">
          <Text className="text-slate-500 text-xs">4 members • 3 activities</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupSettingsModal', { groupId: 'group-village' })}
          >
            <Text className="text-emerald-400 text-xs font-medium">Settings →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
