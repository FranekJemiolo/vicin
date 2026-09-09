import React from 'react';

export interface StatusIndicatorProps {
  status: 'active' | 'expiring' | 'expired';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className = '',
}) => {
  const config = {
    active: {
      dot: 'bg-[#10B981]',
      text: 'text-[#10B981]',
      bg: 'bg-[#10B981]/10',
      border: 'border-[#10B981]/25',
      defaultLabel: 'Active',
      pulse: true,
    },
    expiring: {
      dot: 'bg-[#F59E0B]',
      text: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/10',
      border: 'border-[#F59E0B]/25',
      defaultLabel: 'Expiring Soon',
      pulse: true,
    },
    expired: {
      dot: 'bg-slate-500',
      text: 'text-slate-400',
      bg: 'bg-white/5',
      border: 'border-white/10',
      defaultLabel: 'Expired',
      pulse: false,
    },
  }[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${className}`.trim()}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse' : ''}`}
      />
      <span className={`text-[11px] font-mono font-semibold ${config.text}`}>
        {label || config.defaultLabel}
      </span>
    </div>
  );
};
