import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useGroup } from '../../hooks/useGroup';

type RouteProps = RouteProp<RootStackParamList, 'AcceptInviteModal'>;

export const AcceptInviteModal: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { acceptInvite } = useGroup();
  const token = route.params?.token || 'sample-token';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    const res = await acceptInvite(token);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setGroupName(res.groupName || 'neighborhood group');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } else {
      setError(res.error || 'Failed to accept invite');
    }
  };

  return (
    <View className="flex-1 bg-[#090A0F] px-6 pt-12 items-center justify-center">
      <View className="w-full bg-[#12141C] border border-white/10 rounded-3xl p-6 items-center text-center">
        <View className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center mb-4">
          <Text className="text-2xl">🏡</Text>
        </View>

        <Text className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
          Group Invitation
        </Text>
        <Text className="text-2xl font-bold text-white text-center mb-2">
          {success ? `Welcome to ${groupName}!` : 'Join Neighborhood Circle'}
        </Text>
        <Text className="text-slate-400 text-xs text-center max-w-xs mb-6">
          {success
            ? "You're all set. You can now see availability and broadcast to your group."
            : 'You were invited to broadcast spontaneous availability within this private group.'}
        </Text>

        {error && (
          <View className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
            <Text className="text-rose-400 text-xs font-medium text-center">{error}</Text>
          </View>
        )}

        {!success ? (
          <View className="w-full space-y-3">
            <TouchableOpacity
              onPress={handleAccept}
              disabled={loading}
              className="w-full bg-emerald-500 active:bg-emerald-600 rounded-xl py-3.5 items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-sm">Accept Invitation</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-full py-3 items-center justify-center mt-2"
            >
              <Text className="text-slate-400 text-xs">Decline</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="py-2">
            <Text className="text-emerald-400 font-semibold text-sm">Redirecting to feed...</Text>
          </View>
        )}
      </View>
    </View>
  );
};
