import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div
      className={`bg-[#12141C] border border-white/10 rounded-3xl p-6 shadow-xl ${
        hoverable ? 'hover:border-[#10B981]/40 transition-all duration-200' : ''
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
};
