/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
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
    },
  },
  plugins: [],
};
