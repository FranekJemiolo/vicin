import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-[#090A0F] px-5 pt-14">
      <View className="mb-8">
        <Text className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
          Identity
        </Text>
        <Text className="text-2xl font-bold text-white tracking-tight">Your Profile</Text>
      </View>

      <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 items-center mb-6">
        {user?.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            className="w-20 h-20 rounded-full mb-3 border-2 border-emerald-500/30"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-emerald-500/20 items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-emerald-400">
              {user?.name?.[0]?.toUpperCase() || 'V'}
            </Text>
          </View>
        )}
        <Text className="text-lg font-bold text-white mb-1">{user?.name || 'Neighbor'}</Text>
        <Text className="text-xs text-slate-400">{user?.email}</Text>
      </View>

      <TouchableOpacity
        onPress={() => signOut()}
        className="bg-rose-500/10 border border-rose-500/20 rounded-xl py-3.5 items-center justify-center"
      >
        <Text className="text-rose-400 font-semibold text-sm">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};
