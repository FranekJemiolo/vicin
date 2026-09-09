import { colors, radius } from './tokens';

/**
 * Tailwind CSS configuration preset shared across web and mobile (NativeWind)
 */
export const vicinTailwindPreset = {
  theme: {
    extend: {
      colors: {
        background: colors.background.DEFAULT,
        'background-light': colors.background.light,
        surface: colors.background.surface,
        'surface-light': colors.background.surfaceLight,
        card: colors.background.card,
        'card-light': colors.background.cardLight,
        foreground: colors.foreground.DEFAULT,
        'foreground-light': colors.foreground.light,
        'muted-foreground': colors.foreground.muted,
        brand: {
          DEFAULT: colors.brand.DEFAULT,
          hover: colors.brand.hover,
          muted: colors.brand.muted,
        },
      },
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        xl: `${radius.xl}px`,
      },
    },
  },
};
