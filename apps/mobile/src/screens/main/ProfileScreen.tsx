import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../hooks/useGroup';
import { supabase, isMockMode } from '../../lib/supabase';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { groups } = useGroup();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  ];

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setStatusMsg(null);

    if (!isMockMode && user) {
      await supabase
        .from('users')
        .update({
          name: name.trim(),
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    setSaving(false);
    setIsEditing(false);
    setStatusMsg('Profile updated successfully!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (!isMockMode && user) {
        // Cascading deletion handled via ON DELETE CASCADE foreign keys
        await supabase.from('users').delete().eq('id', user.id);
      }
      await signOut();
    } catch {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#090A0F] pt-12">
      {/* Header */}
      <View className="px-6 pb-4 border-b border-white/10">
        <Text className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
          Identity & Privacy
        </Text>
        <Text className="text-2xl font-bold text-white tracking-tight">Account Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {statusMsg && (
          <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5">
            <Text className="text-emerald-400 text-xs font-medium text-center">{statusMsg}</Text>
          </View>
        )}

        {/* Profile Card */}
        <View className="bg-[#12141C] border border-white/10 rounded-3xl p-6 items-center mb-6 shadow-xl">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-24 h-24 rounded-full mb-4 border-2 border-emerald-500/40"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-emerald-500/20 items-center justify-center mb-4 border-2 border-emerald-500/30">
              <Text className="text-3xl font-extrabold text-emerald-400">
                {name?.[0]?.toUpperCase() || 'V'}
              </Text>
            </View>
          )}

          {isEditing ? (
            <View className="w-full space-y-3">
              <View>
                <Text className="text-xs text-slate-400 mb-1">Display Name</Text>
                <TextInput
                  className="w-full bg-[#1A1D27] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your Name"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View className="mt-2">
                <Text className="text-xs text-slate-400 mb-1.5">Choose Avatar Preset</Text>
                <View className="flex-row justify-center gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setAvatarUrl(preset)}
                      className={`rounded-full p-0.5 border-2 ${
                        avatarUrl === preset ? 'border-emerald-400' : 'border-transparent'
                      }`}
                    >
                      <Image source={{ uri: preset }} className="w-10 h-10 rounded-full" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-3 pt-3">
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 bg-emerald-500 rounded-xl py-3 items-center justify-center"
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-xs">Save Changes</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl items-center justify-center"
                >
                  <Text className="text-slate-400 text-xs">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-xl font-bold text-white mb-1">{user?.name || 'Neighbor'}</Text>
              <Text className="text-xs text-slate-400 mb-3">{user?.email}</Text>

              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
              >
                <Text className="text-emerald-400 text-xs font-semibold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Info Card */}
        <View className="bg-[#12141C] border border-white/10 rounded-2xl p-5 mb-6">
          <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Membership Overview
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between py-1 border-b border-white/5">
              <Text className="text-slate-400 text-xs">Active Circles</Text>
              <Text className="text-white text-xs font-semibold">{groups.length} groups</Text>
            </View>
            <View className="flex-row justify-between py-1 border-b border-white/5">
              <Text className="text-slate-400 text-xs">Auth Provider</Text>
              <Text className="text-white text-xs font-semibold uppercase">
                {user?.auth_provider || 'Email'}
              </Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-slate-400 text-xs">Account ID</Text>
              <Text className="text-slate-500 font-mono text-[10px]">
                {user?.id ? `${user.id.substring(0, 16)}...` : 'Local Dev'}
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="w-full bg-[#12141C] border border-white/10 hover:border-white/20 rounded-2xl py-3.5 items-center justify-center mb-4"
        >
          <Text className="text-slate-300 font-semibold text-xs">Sign Out</Text>
        </TouchableOpacity>

        {/* Danger Zone: Delete Account */}
        <View className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-5">
          <Text className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            Danger Zone
          </Text>
          <Text className="text-slate-400 text-xs mb-4 leading-relaxed">
            Permanently delete your account and all availability broadcasts, memberships, and
            acknowledgments in compliance with App Store guidelines.
          </Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={deleting}
            className="bg-rose-500/15 border border-rose-500/30 rounded-xl py-3 items-center justify-center"
          >
            {deleting ? (
              <ActivityIndicator color="#F43F5E" />
            ) : (
              <Text className="text-rose-400 font-semibold text-xs">Delete My Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
