import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { FeedScreen } from '../screens/main/FeedScreen';
import { GroupsScreen } from '../screens/main/GroupsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

// Modals
import { CreateBroadcastModal } from '../screens/modals/CreateBroadcastModal';
import { CreateGroupModal } from '../screens/modals/CreateGroupModal';
import { AcceptInviteModal } from '../screens/modals/AcceptInviteModal';
import { GroupSettingsModal } from '../screens/modals/GroupSettingsModal';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#090A0F' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#090A0F',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          elevation: 0,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <MainTab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Pulse',
        }}
      />
      <MainTab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarLabel: 'Groups',
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </MainTab.Navigator>
  );
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'vicin://', 'https://vicin.app'],
  config: {
    screens: {
      AcceptInviteModal: 'invite/:token',
      CreateBroadcastModal: 'broadcast/new',
      CreateGroupModal: 'groups/new',
      GroupSettingsModal: 'groups/:groupId/settings',
      MainTabs: {
        screens: {
          Feed: 'feed',
          Groups: 'groups',
          Profile: 'profile',
        },
      },
    },
  },
};

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-[#090A0F] items-center justify-center">
        <ActivityIndicator color="#10B981" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090A0F' },
        }}
      >
        {user ? (
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}

        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="CreateBroadcastModal" component={CreateBroadcastModal} />
          <RootStack.Screen name="CreateGroupModal" component={CreateGroupModal} />
          <RootStack.Screen name="AcceptInviteModal" component={AcceptInviteModal} />
          <RootStack.Screen name="GroupSettingsModal" component={GroupSettingsModal} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
