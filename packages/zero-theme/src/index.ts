// Side-effect import to activate MUI module augmentation
import './augmentation.ts';

// Provider
export { ZeroThemeProvider } from './provider.tsx';
export type { ZeroThemeProviderProps } from './provider.tsx';

// Theme factory
export { createZeroTheme } from './createZeroTheme.ts';
export type { ZeroThemeConfig } from './createZeroTheme.ts';

// Tokens
export { heroui } from './tokens/colors.ts';
export type {
  HeroUIColors,
  ColorScale,
  HeroUISpacingNamed,
  HeroUIRadius,
  HeroUITypography,
  HeroUITypographyToken,
  HeroUIShadows,
  HeroUITransitions,
} from './tokens/colors.ts';

// Custom tokens
export { custom } from './custom.ts';
export type { ZeroCustomTokens } from './types.ts';

// Utilities
export { resolveColor } from './utils/resolveColor.ts';
export { formatNumber } from './utils/formatNumber.ts';
