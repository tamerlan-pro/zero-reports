import type { Components, Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';
import { custom } from '../custom.ts';

export const surfaceComponents: Components<Theme> = {
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        '&:not(.MuiAlert-root):not(.MuiAccordion-root)': {
          background: custom.surface.card.background,
          border: custom.surface.card.border,
          boxShadow: custom.surface.card.shadow,
        },
      },
    },
    variants: [
      {
        props: { variant: 'interactive' },
        style: ({ theme: t }) => ({
          cursor: 'pointer',
          transition: `all ${t.heroui.transitions.normal}`,
          '&:hover': {
            borderColor: t.palette.surface.level5,
            boxShadow: t.heroui.shadows.xl,
            transform: 'translateY(-2px)',
          },
        }),
      },
      {
        props: { variant: 'metric' },
        style: ({ theme: t }) => ({
          transition: `all ${t.heroui.transitions.normal}`,
          '&:hover': {
            borderColor: t.palette.surface.level5,
            boxShadow: t.heroui.shadows.xl,
            transform: 'translateY(-1px)',
          },
        }),
      },
    ],
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme: t }) => ({
        background: custom.surface.card.background,
        border: custom.surface.card.border,
        boxShadow: custom.surface.card.shadow,
        borderRadius: heroui.radius.small,
        fontSize: heroui.typography.small.fontSize,
        color: t.palette.text.primary,
      }),
      arrow: {
        color: heroui.layout.background,
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        backgroundColor: t.palette.surface.level3,
      }),
    },
  },
};
