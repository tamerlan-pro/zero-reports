import type { Theme } from '@mui/material/styles';

const PALETTE_KEYS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

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
    const name = token.slice(0, dotIdx);
    const weight = Number(token.slice(dotIdx + 1));
    const heroui = (theme as any).heroui;
    if (heroui?.[name]?.[weight]) return heroui[name][weight];
  }

  if (token === 'danger') return theme.palette.error.main;

  if ((PALETTE_KEYS as readonly string[]).includes(token)) {
    return (theme.palette as any)[token]?.main;
  }

  return token;
}
