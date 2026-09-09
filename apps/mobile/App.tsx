import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProviderComponent } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProviderComponent>
            <ToastProvider>
              <RootNavigator />
              <StatusBar style="light" />
            </ToastProvider>
          </AuthProviderComponent>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
