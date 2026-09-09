import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const CreateGroupModal: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-[#090A0F] px-6 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-white">Create Closed Group</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-slate-400 text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-slate-400 text-sm">
        Create a private availability circle for your building or friends.
      </Text>
    </View>
  );
};
