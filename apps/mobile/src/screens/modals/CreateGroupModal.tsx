import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGroup } from '../../hooks/useGroup';

export const CreateGroupModal: React.FC = () => {
  const navigation = useNavigation();
  const { createGroup } = useGroup();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please provide a group name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const group = await createGroup(name.trim(), description.trim());
      if (group) {
        navigation.goBack();
      } else {
        setError('Failed to create group');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#090A0F] px-6 pt-10">
      <View className="flex-row items-center justify-between mb-8 pb-4 border-b border-white/10">
        <View>
          <Text className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Closed Loop
          </Text>
          <Text className="text-2xl font-bold text-white tracking-tight">Create Group</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} className="py-2 px-3">
          <Text className="text-slate-400 text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
          <Text className="text-rose-400 text-xs font-medium">{error}</Text>
        </View>
      )}

      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-xs font-medium text-slate-300 mb-1.5">Group Name</Text>
          <TextInput
            className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm"
            placeholder="e.g. 10th Floor Neighbors, Studio Pod"
            placeholderTextColor="#64748B"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mt-4">
          <Text className="text-xs font-medium text-slate-300 mb-1.5">Description (Optional)</Text>
          <TextInput
            className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm"
            placeholder="e.g. Spontaneous availability for coffee, walks, and building chats"
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        className="w-full bg-emerald-500 active:bg-emerald-600 rounded-xl py-3.5 items-center justify-center shadow-lg shadow-emerald-500/20"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-semibold text-sm">Create Group</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
