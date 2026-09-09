import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthProvider } from '@vicin/shared';
import { supabase, isMockMode, MOCK_USER } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Session, Provider } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signInWithOAuth: (provider: AuthProvider) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@vicin_auth_user';

export const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initSession() {
      try {
        if (isMockMode) {
          const cachedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          } else {
            // Default logged-in mock user for seamless preview
            setUser(MOCK_USER);
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_USER));
          }
          setSession({ access_token: 'mock-token' } as Session);
        } else {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          if (data.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              auth_provider: (data.session.user.app_metadata.provider as AuthProvider) || 'email',
              name: data.session.user.user_metadata?.name || 'Vicin Neighbor',
              avatar_url: data.session.user.user_metadata?.avatar_url,
              created_at: data.session.user.created_at,
              updated_at: data.session.user.updated_at || data.session.user.created_at,
            });
          }
        }
      } catch (err) {
        console.error('Failed restoring auth session:', err);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    if (!isMockMode) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setUser({
            id: newSession.user.id,
            email: newSession.user.email || '',
            auth_provider: (newSession.user.app_metadata.provider as AuthProvider) || 'email',
            name: newSession.user.user_metadata?.name || 'Vicin Neighbor',
            avatar_url: newSession.user.user_metadata?.avatar_url,
            created_at: newSession.user.created_at,
            updated_at: newSession.user.updated_at || newSession.user.created_at,
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithEmail = async (email: string, _password: string) => {
    try {
      if (isMockMode) {
        const mockUser: User = {
          ...MOCK_USER,
          email,
          name: email.split('@')[0],
        };
        setUser(mockUser);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        return {};
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
      if (error) return { error: error.message };
      return {};
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login failed';
      return { error: message };
    }
  };

  const signUpWithEmail = async (email: string, _password: string, name: string) => {
    try {
      if (isMockMode) {
        const mockUser: User = {
          ...MOCK_USER,
          email,
          name,
        };
        setUser(mockUser);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        return {};
      }

      const { error } = await supabase.auth.signUp({
        email,
        password: _password,
        options: { data: { name } },
      });
      if (error) return { error: error.message };
      return {};
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Signup failed';
      return { error: message };
    }
  };

  const signInWithOAuth = async (provider: AuthProvider) => {
    try {
      if (isMockMode) {
        const mockUser: User = {
          ...MOCK_USER,
          auth_provider: provider,
          name: `${provider.toUpperCase()} Neighbor`,
        };
        setUser(mockUser);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        return {};
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: { redirectTo: 'vicin://auth/callback' },
      });
      if (error) return { error: error.message };
      return {};
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : `${provider} authentication failed`;
      return { error: message };
    }
  };

  const signOut = async () => {
    if (isMockMode) {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderComponent');
  }
  return context;
}
