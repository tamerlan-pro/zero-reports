import type { PaletteOptions } from '@mui/material/styles';
import { heroui } from './tokens/colors.ts';

const BG_DEFAULT = heroui.layout.background;
const BG_PAPER = heroui.content[1];

export const palette: PaletteOptions & {
  surface?: {
    level1: string; level2: string; level3: string; level4: string;
    level5: string; level6: string; level7: string;
  };
} = {
  mode: 'dark',
  primary: {
    main: heroui.primary[400],
    light: heroui.primary[500],
    dark: heroui.primary[300],
  },
  secondary: {
    main: heroui.secondary[400],
    light: heroui.secondary[500],
    dark: heroui.secondary[300],
  },
  background: {
    default: BG_DEFAULT,
    paper: BG_PAPER,
  },
  success: {
    main: heroui.success[400],
    light: heroui.success[500],
    dark: heroui.success[300],
  },
  warning: {
    main: heroui.warning[400],
    light: heroui.warning[500],
    dark: heroui.warning[300],
  },
  error: {
    main: heroui.danger[400],
    light: heroui.danger[500],
    dark: heroui.danger[300],
  },
  info: {
    main: '#06B7DB',
    light: '#7EE7FC',
    dark: '#09AACD',
  },
  surface: {
    level1: 'rgba(255,255,255,0.04)',
    level2: 'rgba(255,255,255,0.06)',
    level3: 'rgba(255,255,255,0.1)',
    level4: 'rgba(255,255,255,0.14)',
    level5: 'rgba(255,255,255,0.18)',
    level6: 'rgba(255,255,255,0.22)',
    level7: 'rgba(255,255,255,0.28)',
  },
  divider: heroui.layout.divider,
  text: {
    primary: heroui.layout.foreground,
    secondary: heroui.default[500],
    caption: heroui.default[400],
  },
};

export { BG_DEFAULT, BG_PAPER };
