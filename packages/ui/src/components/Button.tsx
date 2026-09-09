import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-semibold transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    primary:
      'bg-[#10B981] hover:bg-[#059669] text-white shadow-lg shadow-[#10B981]/25 border border-transparent',
    secondary:
      'bg-[#12141C] hover:bg-[#1A1D27] text-white border border-white/10 hover:border-white/20',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
    danger: 'bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/20',
  },
  sizes: {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const combinedClassName = `${buttonStyles.base} ${buttonStyles.variants[variant]} ${
    buttonStyles.sizes[size]
  } ${fullWidth ? 'w-full' : ''} ${className}`.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
