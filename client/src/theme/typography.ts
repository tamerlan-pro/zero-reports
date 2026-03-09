import type { ThemeOptions } from '@mui/material/styles';
type TypographyOptions = NonNullable<ThemeOptions['typography']>;
import { heroui } from './tokens/colors.ts';

export const typography: TypographyOptions = {
  fontFamily: heroui.typography.fontFamily,
  h1: {
    fontSize: '3em',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(to bottom, #4a4a4a, #cccccc)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
  h3: { fontSize: '1.5rem', fontWeight: 600 },
  h4: { fontSize: '1.25rem', fontWeight: 600 },
  h5: {
    fontSize: heroui.typography.large.fontSize,
    fontWeight: 600,
    lineHeight: heroui.typography.large.lineHeight,
  },
  h6: {
    fontSize: heroui.typography.medium.fontSize,
    fontWeight: 600,
    lineHeight: heroui.typography.medium.lineHeight,
  },
  body1: {
    fontSize: heroui.typography.medium.fontSize,
    fontWeight: 400,
    lineHeight: heroui.typography.medium.lineHeight,
  },
  body2: {
    fontSize: heroui.typography.small.fontSize,
    fontWeight: 400,
    lineHeight: heroui.typography.small.lineHeight,
  },
  caption: {
    fontSize: heroui.typography.tiny.fontSize,
    fontWeight: 400,
    lineHeight: heroui.typography.tiny.lineHeight,
    color: heroui.default[400],
  },
};
