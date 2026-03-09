import { describe, it, expect } from 'vitest';
import { createZeroTheme } from './createZeroTheme.ts';

describe('createZeroTheme', () => {
  it('creates a theme without throwing', () => {
    expect(() => createZeroTheme()).not.toThrow();
  });

  it('exposes heroui tokens on the theme object', () => {
    const theme = createZeroTheme();
    expect(theme.heroui).toBeDefined();
    expect(theme.heroui.primary).toBeDefined();
    expect(typeof theme.heroui.primary[400]).toBe('string');
  });

  it('exposes custom tokens on the theme object', () => {
    const theme = createZeroTheme();
    expect(theme.custom).toBeDefined();
    expect(Array.isArray(theme.custom.chartColors)).toBe(true);
    expect(theme.custom.chartColors.length).toBeGreaterThan(0);
    expect(theme.custom.layout.maxWidth).toBeGreaterThan(0);
  });

  it('applies shape borderRadius from heroui radius token', () => {
    const theme = createZeroTheme();
    expect(theme.shape.borderRadius).toBe(theme.heroui.radius.medium);
  });

  it('applies overrides when provided', () => {
    const theme = createZeroTheme({ overrides: { shape: { borderRadius: 0 } } });
    expect(theme.shape.borderRadius).toBe(0);
  });

  it('exposes palette.surface with all levels defined', () => {
    const theme = createZeroTheme();
    expect(theme.palette.surface).toBeDefined();
    expect(theme.palette.surface.level3).toBeTruthy();
    expect(theme.palette.surface.level5).toBeTruthy();
  });

  it('has a complete palette with primary and error colors', () => {
    const theme = createZeroTheme();
    expect(theme.palette.primary.main).toBeTruthy();
    expect(theme.palette.error.main).toBeTruthy();
    expect(theme.palette.success.main).toBeTruthy();
  });

  it('matches token snapshot', () => {
    const theme = createZeroTheme();
    expect({
      primaryMain: theme.heroui.primary[400],
      chartColorsCount: theme.custom.chartColors.length,
      maxWidth: theme.custom.layout.maxWidth,
      borderRadius: theme.shape.borderRadius,
    }).toMatchSnapshot();
  });
});
