import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProviderComponent } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProviderComponent>
        <RootNavigator />
        <StatusBar style="light" />
      </AuthProviderComponent>
    </SafeAreaProvider>
  );
}
