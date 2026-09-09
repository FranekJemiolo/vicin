import React from 'react';

export interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 'md', className = '' }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-white/10 ${className}`.trim()}
      />
    );
  }

  const initial = name ? name[0].toUpperCase() : 'N';
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#10B981]/20 text-[#10B981] font-bold flex items-center justify-center border border-[#10B981]/30 ${className}`.trim()}
    >
      {initial}
    </div>
  );
};
