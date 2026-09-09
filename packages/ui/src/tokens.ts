/**
 * Vicin Design Tokens
 * Casual, modern, minimalist aesthetic.
 * Generous whitespace, refined typography, subtle status accents.
 */

export const colors = {
  background: {
    DEFAULT: '#090A0F',
    light: '#FAFAFA',
    card: '#12141C',
    cardLight: '#FFFFFF',
    surface: '#1A1D27',
    surfaceLight: '#F3F4F6',
  },
  foreground: {
    DEFAULT: '#F8FAFC',
    light: '#0F172A',
    muted: '#94A3B8',
    mutedLight: '#64748B',
  },
  brand: {
    DEFAULT: '#10B981', // Emerald - Availability indicator
    hover: '#059669',
    muted: 'rgba(16, 185, 129, 0.12)',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  accent: {
    amber: '#F59E0B',
    amberMuted: 'rgba(245, 158, 11, 0.12)',
    rose: '#F43F5E',
    roseMuted: 'rgba(244, 63, 94, 0.12)',
    indigo: '#6366F1',
    indigoMuted: 'rgba(99, 102, 241, 0.12)',
  },
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(0, 0, 0, 0.08)',
    active: 'rgba(16, 185, 129, 0.4)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
  },
};
