import React from 'react';
import { View } from 'react-native';

export const FeedSkeletonLoader: React.FC = () => {
  return (
    <View className="space-y-4">
      {[1, 2].map(idx => (
        <View
          key={idx}
          className="bg-[#12141C] border border-white/5 rounded-3xl p-5 mb-4 opacity-75"
        >
          {/* Top row */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#1A1D27] animate-pulse" />
              <View className="space-y-1.5">
                <View className="w-24 h-3 rounded-md bg-[#1A1D27] animate-pulse" />
                <View className="w-32 h-2.5 rounded-md bg-[#1A1D27] animate-pulse" />
              </View>
            </View>
            <View className="w-16 h-6 rounded-full bg-[#1A1D27] animate-pulse" />
          </View>

          {/* Activity Callout skeleton */}
          <View className="bg-[#1A1D27]/50 rounded-2xl p-4 mb-4 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-[#12141C] animate-pulse" />
            <View className="flex-1 space-y-2">
              <View className="w-28 h-3.5 rounded bg-[#12141C] animate-pulse" />
              <View className="w-48 h-2.5 rounded bg-[#12141C] animate-pulse" />
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-1">
            <View className="w-20 h-3 rounded bg-[#1A1D27] animate-pulse" />
            <View className="w-24 h-8 rounded-xl bg-[#1A1D27] animate-pulse" />
          </View>
        </View>
      ))}
    </View>
  );
};
