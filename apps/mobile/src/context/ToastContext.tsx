import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (props: {
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);

  const hideToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const showToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 3500,
    }: {
      type?: ToastType;
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(7);
      const toast: ToastMessage = { id, type, title, message, duration };
      setActiveToast(toast);

      if (duration > 0) {
        setTimeout(() => {
          setActiveToast(current => (current?.id === id ? null : current));
        }, duration);
      }
    },
    []
  );

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/90',
          border: 'border-emerald-500/40',
          text: 'text-emerald-300',
          icon: '✓',
          badgeBg: 'bg-emerald-500/20',
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90',
          border: 'border-rose-500/40',
          text: 'text-rose-300',
          icon: '✕',
          badgeBg: 'bg-rose-500/20',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          icon: '⚠',
          badgeBg: 'bg-amber-500/20',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#12141C]/95',
          border: 'border-white/10',
          text: 'text-slate-200',
          icon: 'ℹ',
          badgeBg: 'bg-white/10',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {activeToast && (
        <View className="absolute top-12 left-4 right-4 z-50 pointer-events-box-none">
          {(() => {
            const styles = getToastColors(activeToast.type);
            return (
              <View
                className={`flex-row items-center justify-between p-4 rounded-2xl border ${styles.bg} ${styles.border} shadow-2xl backdrop-blur-md`}
              >
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${styles.badgeBg}`}
                  >
                    <Text className={`text-xs font-bold ${styles.text}`}>{styles.icon}</Text>
                  </View>
                  <View className="flex-1">
                    {activeToast.title && (
                      <Text className="text-xs font-bold text-white mb-0.5">
                        {activeToast.title}
                      </Text>
                    )}
                    <Text className={`text-xs ${styles.text} leading-tight`}>
                      {activeToast.message}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={hideToast}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="w-6 h-6 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
                >
                  <Text className="text-slate-400 text-xs font-bold">×</Text>
                </TouchableOpacity>
              </View>
            );
          })()}
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
