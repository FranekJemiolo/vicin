import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, forward to Sentry, Datadog or custom telemetry endpoint
    console.error('[Vicin Telemetry: Uncaught Error]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView className="flex-1 bg-[#090A0F] items-center justify-center px-6">
          <View className="w-full max-w-sm items-center text-center">
            <View className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 items-center justify-center mb-6 shadow-xl">
              <Text className="text-3xl">⚠️</Text>
            </View>

            <Text className="text-2xl font-bold text-white mb-2 text-center">
              Something went wrong
            </Text>
            <Text className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
              Vicin encountered an unexpected issue. Don't worry—your availability and group data
              are safe.
            </Text>

            {this.state.error && (
              <ScrollView
                className="w-full max-h-32 bg-[#12141C] border border-white/5 rounded-2xl p-4 mb-6"
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Text className="text-rose-400 font-mono text-[11px]">
                  {this.state.error.name}: {this.state.error.message}
                </Text>
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={this.handleReset}
              className="w-full bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center shadow-lg shadow-emerald-500/25"
            >
              <Text className="text-white font-bold text-xs tracking-wider uppercase">
                Reload Vicin
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
