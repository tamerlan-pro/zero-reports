import { describe, it, expect, vi } from 'vitest';
import { resolveColor } from './resolveColor.ts';
import type { Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';

const mockTheme = {
  heroui,
  palette: {
    primary: { main: '#006FEE' },
    secondary: { main: '#7828C8' },
    success: { main: '#17C964' },
    warning: { main: '#F5A524' },
    error: { main: '#F31260' },
    info: { main: '#06B7DB' },
  },
} as unknown as Theme;

describe('resolveColor', () => {
  it('returns undefined for falsy input', () => {
    expect(resolveColor(undefined, mockTheme)).toBeUndefined();
    expect(resolveColor('', mockTheme)).toBeUndefined();
  });

  it('returns hex string as-is', () => {
    expect(resolveColor('#006FEE', mockTheme)).toBe('#006FEE');
    expect(resolveColor('#fff', mockTheme)).toBe('#fff');
    expect(resolveColor('#AABBCCDD', mockTheme)).toBe('#AABBCCDD');
  });

  it('resolves palette key to main color', () => {
    expect(resolveColor('primary', mockTheme)).toBe('#006FEE');
    expect(resolveColor('secondary', mockTheme)).toBe('#7828C8');
    expect(resolveColor('success', mockTheme)).toBe('#17C964');
    expect(resolveColor('warning', mockTheme)).toBe('#F5A524');
    expect(resolveColor('error', mockTheme)).toBe('#F31260');
    expect(resolveColor('info', mockTheme)).toBe('#06B7DB');
  });

  it('resolves "danger" alias to error.main', () => {
    expect(resolveColor('danger', mockTheme)).toBe('#F31260');
  });

  it('resolves dot-notation token (e.g. "primary.400")', () => {
    const expected = heroui.primary[400];
    expect(resolveColor('primary.400', mockTheme)).toBe(expected);
  });

  it('resolves dot-notation token for danger scale', () => {
    const expected = heroui.danger[200];
    expect(resolveColor('danger.200', mockTheme)).toBe(expected);
  });

  it('returns undefined for unknown token (with DEV warning)', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = resolveColor('not-a-real-token', mockTheme);
    expect(result).toBeUndefined();
    spy.mockRestore();
  });
});
