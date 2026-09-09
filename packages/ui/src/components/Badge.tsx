import React from 'react';

export interface BadgeProps {
  variant?: 'brand' | 'amber' | 'rose' | 'neutral';
  size?: 'sm' | 'md';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const badgeStyles = {
  base: 'inline-flex items-center gap-1.5 rounded-full font-semibold font-mono uppercase tracking-wider',
  variants: {
    brand: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    amber: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    rose: 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30',
    neutral: 'bg-white/5 text-slate-300 border border-white/10',
  },
  sizes: {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'brand',
  size = 'sm',
  pulse = false,
  children,
  className = '',
}) => {
  return (
    <span
      className={`${badgeStyles.base} ${badgeStyles.variants[variant]} ${badgeStyles.sizes[size]} ${className}`.trim()}
    >
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
};
