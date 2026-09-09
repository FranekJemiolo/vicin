import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useGroup } from '../../hooks/useGroup';
import { useAuth } from '../../context/AuthContext';

type RouteProps = RouteProp<RootStackParamList, 'GroupSettingsModal'>;

export const GroupSettingsModal: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { user } = useAuth();
  const {
    currentGroup,
    activities,
    members,
    addActivity,
    deleteActivity,
    createInvite,
    togglePush,
    leaveGroup,
    removeMember,
    promoteMember,
  } = useGroup();

  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [newActName, setNewActName] = useState('');
  const [newActEmoji, setNewActEmoji] = useState('☕');
  const [newActDuration, setNewActDuration] = useState('45');
  const [showAddAct, setShowAddAct] = useState(false);

  const currentUserMembership = members.find(m => m.user_id === user?.id);
  const isPushEnabled = currentUserMembership?.push_enabled ?? true;

  const handleGenerateInvite = async () => {
    const link = await createInvite(route.params.groupId);
    setInviteUrl(link);
  };

  const handleAddActivity = async () => {
    if (!newActName.trim()) return;
    await addActivity(
      route.params.groupId,
      newActName.trim(),
      newActEmoji.trim() || '⚡',
      parseInt(newActDuration, 10) || 60
    );
    setNewActName('');
    setShowAddAct(false);
  };

  const handleLeave = async () => {
    await leaveGroup(route.params.groupId);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#090A0F] pt-8">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4 border-b border-white/10">
        <View>
          <Text className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Circle Configuration
          </Text>
          <Text className="text-2xl font-bold text-white tracking-tight">
            {currentGroup?.name || 'Group Settings'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 px-3">
          <Text className="text-slate-400 text-sm">Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {/* Invite Link Section */}
        <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-6">
          <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Member Invitations
          </Text>
          <Text className="text-xs text-slate-400 mb-4">
            Generate an encrypted invite deep link to add trusted neighbors to this circle.
          </Text>

          {inviteUrl ? (
            <View className="bg-[#1A1D27] border border-emerald-500/30 rounded-xl p-3 mb-2">
              <Text className="text-emerald-400 font-mono text-xs select-all">{inviteUrl}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleGenerateInvite}
              className="bg-emerald-500 active:bg-emerald-600 rounded-xl py-3 items-center justify-center"
            >
              <Text className="text-white font-semibold text-xs">+ Generate Invite Deep Link</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Push Notification Preferences */}
        <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-6 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-white">Broadcast Push Notifications</Text>
            <Text className="text-xs text-slate-400 mt-0.5">
              Receive alerts when neighbors broadcast availability
            </Text>
          </View>
          <Switch
            value={isPushEnabled}
            onValueChange={val => togglePush(route.params.groupId, val)}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Activities Dictionary */}
        <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Group Activities Dictionary
            </Text>
            <TouchableOpacity onPress={() => setShowAddAct(!showAddAct)}>
              <Text className="text-emerald-400 text-xs font-semibold">
                {showAddAct ? 'Cancel' : '+ Add Activity'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAddAct && (
            <View className="bg-[#1A1D27] border border-white/10 rounded-xl p-4 mb-4 space-y-3">
              <View className="flex-row gap-2">
                <TextInput
                  className="w-14 bg-[#12141C] border border-white/10 rounded-lg text-center text-lg text-white p-2"
                  value={newActEmoji}
                  onChangeText={setNewActEmoji}
                  maxLength={2}
                />
                <TextInput
                  className="flex-1 bg-[#12141C] border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                  placeholder="Activity Name (e.g. Evening Padel)"
                  placeholderTextColor="#64748B"
                  value={newActName}
                  onChangeText={setNewActName}
                />
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <Text className="text-xs text-slate-400">Duration (mins):</Text>
                <TextInput
                  className="w-20 bg-[#12141C] border border-white/10 rounded-lg text-center text-xs text-white py-1.5"
                  value={newActDuration}
                  onChangeText={setNewActDuration}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                onPress={handleAddActivity}
                className="bg-emerald-500 rounded-lg py-2.5 items-center justify-center mt-2"
              >
                <Text className="text-white font-semibold text-xs">Save Activity</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="space-y-2">
            {activities.map(act => (
              <View
                key={act.id}
                className="flex-row items-center justify-between py-2.5 px-3 rounded-xl bg-[#1A1D27]/50 border border-white/5"
              >
                <View className="flex-row items-center gap-2.5">
                  <Text className="text-lg">{act.emoji}</Text>
                  <View>
                    <Text className="text-white text-xs font-medium">{act.name}</Text>
                    <Text className="text-slate-500 text-[10px]">
                      {act.default_duration_mins} mins default
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => deleteActivity(act.id)}
                  className="py-1 px-2 rounded-md hover:bg-rose-500/10"
                >
                  <Text className="text-rose-400 text-xs">Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Group Members List & Admin Actions */}
        <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-8">
          <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Active Members ({members.length})
          </Text>
          <View className="space-y-3">
            {members.map(m => {
              const isMe = m.user_id === user?.id;
              const isOwner = currentUserMembership?.role === 'owner';
              const isAdmin = currentUserMembership?.role === 'admin';
              const canManage = (isOwner || isAdmin) && !isMe && m.role !== 'owner';

              return (
                <View
                  key={m.user_id}
                  className="flex-row items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-7 h-7 rounded-full bg-emerald-500/20 items-center justify-center">
                      <Text className="text-xs text-emerald-400 font-bold">
                        {m.user?.name?.[0] || 'M'}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white text-xs font-medium">
                        {m.user?.name || 'Member'}
                        {isMe ? ' (You)' : ''}
                      </Text>
                      <Text className="text-slate-500 text-[10px] uppercase font-semibold">
                        {m.role}
                      </Text>
                    </View>
                  </View>

                  {canManage ? (
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() =>
                          promoteMember(
                            route.params.groupId,
                            m.user_id,
                            m.role === 'admin' ? 'member' : 'admin'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
                      >
                        <Text className="text-slate-300 text-[10px] font-semibold">
                          {m.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => removeMember(route.params.groupId, m.user_id)}
                        className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
                      >
                        <Text className="text-rose-400 text-[10px] font-semibold">Kick</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Danger Zone: Leave Group */}
        <TouchableOpacity
          onPress={handleLeave}
          className="bg-rose-500/10 border border-rose-500/20 rounded-xl py-3.5 items-center justify-center"
        >
          <Text className="text-rose-400 font-semibold text-xs">Leave this Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
