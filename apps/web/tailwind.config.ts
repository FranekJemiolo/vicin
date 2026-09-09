import type { Config } from 'tailwindcss';
import { vicinTailwindPreset } from '@vicin/ui';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [vicinTailwindPreset as unknown as Config],
  theme: {
    extend: {
      colors: {
        background: '#090A0F',
        card: '#12141C',
        surface: '#1A1D27',
        border: 'rgba(255, 255, 255, 0.08)',
        brand: {
          DEFAULT: '#10B981',
          hover: '#059669',
          muted: 'rgba(16, 185, 129, 0.12)',
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
