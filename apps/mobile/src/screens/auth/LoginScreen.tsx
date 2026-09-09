import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signInWithEmail, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    if (!email) {
      setErrorMsg('Please enter your email');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithEmail(email, password || 'password123');
    setLoading(false);
    if (error) {
      setErrorMsg(error);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithOAuth(provider);
    setLoading(false);
    if (error) {
      setErrorMsg(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#090A0F]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-3 h-3 rounded-full bg-emerald-500" />
            <Text className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Vicin
            </Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</Text>
          <Text className="text-slate-400 text-sm">
            Sign in to check spontaneous availability in your neighborhood.
          </Text>
        </View>

        {errorMsg && (
          <View className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
            <Text className="text-rose-400 text-xs font-medium">{errorMsg}</Text>
          </View>
        )}

        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-xs font-medium text-slate-300 mb-1.5">Email</Text>
            <TextInput
              className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm"
              placeholder="neighbor@example.com"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-3">
            <Text className="text-xs font-medium text-slate-300 mb-1.5">Password</Text>
            <TextInput
              className="w-full bg-[#12141C] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm"
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleEmailLogin}
          disabled={loading}
          className="w-full bg-emerald-500 active:bg-emerald-600 rounded-xl py-3.5 items-center justify-center mb-4 shadow-lg shadow-emerald-500/20"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold text-sm">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-white/10" />
          <Text className="px-3 text-xs text-slate-500 uppercase tracking-wider">
            Or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-white/10" />
        </View>

        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => handleOAuth('apple')}
            className="flex-1 bg-[#12141C] border border-white/10 rounded-xl py-3 items-center justify-center"
          >
            <Text className="text-white font-medium text-xs">Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOAuth('google')}
            className="flex-1 bg-[#12141C] border border-white/10 rounded-xl py-3 items-center justify-center"
          >
            <Text className="text-white font-medium text-xs">Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOAuth('facebook')}
            className="flex-1 bg-[#12141C] border border-white/10 rounded-xl py-3 items-center justify-center"
          >
            <Text className="text-white font-medium text-xs">Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="items-center py-2"
        >
          <Text className="text-slate-400 text-xs">
            Don't have an account? <Text className="text-emerald-400 font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
