import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';

export const buttonComponents: Components<Theme> = {
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '&:focus-visible': {
          outline: `2px solid ${heroui.layout.focus}`,
          outlineOffset: 2,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: heroui.radius.medium,
        textTransform: 'none' as const,
        fontWeight: 500,
      },
      outlined: ({ ownerState, theme: t }) => {
        const paletteColor = ownerState.color && ownerState.color !== 'inherit'
          ? t.palette[ownerState.color as keyof typeof t.palette]
          : undefined;
        const color = paletteColor && 'main' in paletteColor
          ? (paletteColor as { main: string }).main
          : undefined;
        return {
          borderColor: 'currentColor',
          '&:hover': {
            borderColor: 'currentColor',
            backgroundColor: color ? alpha(color, 0.12) : 'rgba(255,255,255,0.06)',
          },
        };
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        '&:hover': {
          backgroundColor: t.palette.surface.level3,
        },
      }),
    },
  },
};
