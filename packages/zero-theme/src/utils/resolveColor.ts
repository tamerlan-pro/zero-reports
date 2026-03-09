import type { Theme } from '@mui/material/styles';
import type { HeroUIColors } from '../tokens/colors.ts';

const PALETTE_KEYS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
type PaletteKey = typeof PALETTE_KEYS[number];

function isPaletteKey(token: string): token is PaletteKey {
  return (PALETTE_KEYS as readonly string[]).includes(token);
}

/**
 * Resolves a color token from report JSON into a hex value using the theme.
 *
 * Supported formats:
 *  - undefined        → returns undefined (caller applies its own fallback)
 *  - "#RRGGBB"        → returned as-is (backward compatibility)
 *  - "primary"        → theme.palette.primary.main
 *  - "danger"         → theme.palette.error.main (alias)
 *  - "primary.400"    → theme.heroui.primary[400]
 *  - "danger.200"     → theme.heroui.danger[200]
 */
export function resolveColor(
  token: string | undefined,
  theme: Theme,
): string | undefined {
  if (!token) return undefined;
  if (token.startsWith('#')) return token;

  const dotIdx = token.indexOf('.');
  if (dotIdx > 0) {
    const name = token.slice(0, dotIdx) as keyof HeroUIColors;
    const weight = Number(token.slice(dotIdx + 1)) as 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    const scale = theme.heroui[name];
    if (scale && typeof scale === 'object' && weight in scale) {
      const color = (scale as Record<number, string>)[weight];
      if (color) return color;
    }
  }

  if (token === 'danger') return theme.palette.error.main;

  if (isPaletteKey(token)) {
    return theme.palette[token].main;
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.warn(`[resolveColor] Unknown color token: "${token}"`);
  }

  return token;
}
