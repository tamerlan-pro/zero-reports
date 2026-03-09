import type { Components, Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';

export const navigationComponents: Components<Theme> = {
  MuiTabs: {
    styleOverrides: {
      root: {
        backgroundColor: heroui.default[100],
        borderRadius: heroui.radius.medium,
        padding: 4,
        minHeight: 'auto',
        width: 'fit-content',
      },
      flexContainer: {
        gap: 8,
        position: 'relative' as const,
      },
      indicator: {
        height: '100%',
        borderRadius: heroui.radius.small,
        backgroundColor: heroui.default[200],
        boxShadow: heroui.shadows.sm,
        zIndex: 0,
        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  MuiTab: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        minHeight: 'auto',
        minWidth: 'auto',
        padding: '4px 12px',
        borderRadius: heroui.radius.small,
        fontSize: heroui.typography.small.fontSize,
        fontWeight: 400,
        lineHeight: '20px',
        textTransform: 'none' as const,
        color: heroui.default[500],
        zIndex: 1,
        transition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&.Mui-selected': {
          color: heroui.layout.foreground,
        },
        '&:hover:not(.Mui-selected)': {
          color: heroui.default[600],
        },
        '&.Mui-disabled': {
          color: heroui.default[300],
          opacity: 0.5,
        },
      },
    },
  },
};
