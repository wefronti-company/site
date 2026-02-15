import { colors } from './colors';

export { colors };

/** Espaçamento em px (4, 8, 12, 16, 24, 32, 48, 64, 96) */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  24: 96,
} as const;

/** Tamanhos de fonte em px */
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

/** Border radius em px */
export const radii = {
  sm: 4,
  md: 6,
  full: 9999,
} as const;

/** Breakpoints em px (para useMediaQuery) */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Container max-width em px */
export const containerMaxWidth = {
  narrow: 768,
  wide: 1152,
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes,
  radii,
  breakpoints,
  containerMaxWidth,
} as const;

export type Theme = typeof theme;
