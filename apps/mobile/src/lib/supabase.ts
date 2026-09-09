import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { User } from '@vicin/shared';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-supabase.vicin.app';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isMockMode =
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL.includes('mock-supabase');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const MOCK_USER: User = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'alice@vicin.app',
  auth_provider: 'email',
  name: 'Alice Chen',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  expo_push_token: 'ExponentPushToken[mock_alice_token]',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
