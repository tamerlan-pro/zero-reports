import type { Components, Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';

export const dataDisplayComponents: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: heroui.typography.small.fontSize,
      },
    },
  },
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
      elevation: 0,
    },
    styleOverrides: {
      root: {
        background: heroui.content[1],
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
        '&::before': {
          backgroundColor: heroui.layout.divider,
          opacity: '1 !important',
          display: 'block !important',
        },
        '&:first-of-type': {
          borderTopLeftRadius: heroui.radius.medium,
          borderTopRightRadius: heroui.radius.medium,
          boxShadow: '0px -2px 4px -2px rgba(0,0,0,0.1)',
          '&::before': { display: 'none !important' },
        },
        '&:last-of-type': {
          borderBottomLeftRadius: heroui.radius.medium,
          borderBottomRightRadius: heroui.radius.medium,
          boxShadow: heroui.shadows.md,
        },
        '&:only-of-type': {
          borderRadius: heroui.radius.medium,
          boxShadow: heroui.shadows.md,
        },
        '&.Mui-expanded': { margin: 0 },
        '&.Mui-disabled': {
          backgroundColor: heroui.content[1],
          opacity: 0.5,
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 16px',
        minHeight: 'auto',
        '&.Mui-expanded': { minHeight: 'auto' },
      },
      content: {
        margin: '16px 0',
        '& .MuiTypography-root': {
          fontSize: heroui.typography.medium.fontSize,
          fontWeight: 600,
          lineHeight: '28px',
          color: heroui.layout.foreground,
        },
        '&.Mui-expanded': { margin: '16px 0' },
      },
      expandIconWrapper: {
        color: heroui.default[500],
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 16px 16px',
        color: heroui.default[500],
      },
    },
  },
  MuiSwitch: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        width: 48,
        height: 28,
        padding: 0,
        overflow: 'hidden',
        borderRadius: heroui.radius.full,
        '&.MuiSwitch-sizeSmall': {
          width: 40,
          height: 24,
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': { transform: 'translateX(16px)' },
          },
          '& .MuiSwitch-thumb': { width: 20, height: 20 },
        },
      },
      switchBase: {
        padding: 4,
        color: heroui.layout.foreground,
        transition: `transform ${heroui.transitions.fast}`,
        '&:hover': { backgroundColor: 'transparent' },
        '&.Mui-checked': {
          transform: 'translateX(20px)',
          color: heroui.layout.foreground,
        },
        '&.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.default[500],
          opacity: 1,
        },
        '&.Mui-disabled': {
          color: heroui.layout.foreground,
          opacity: 0.5,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
        '&.MuiSwitch-colorSuccess.Mui-checked': { color: heroui.layout.foreground },
        '&.MuiSwitch-colorSuccess.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.success[400],
          opacity: 1,
        },
        '&.MuiSwitch-colorWarning.Mui-checked': { color: heroui.layout.foreground },
        '&.MuiSwitch-colorWarning.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.warning[400],
          opacity: 1,
        },
        '&.MuiSwitch-colorError.Mui-checked': { color: heroui.layout.foreground },
        '&.MuiSwitch-colorError.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.danger[400],
          opacity: 1,
        },
        '&.MuiSwitch-colorInfo.Mui-checked': { color: heroui.layout.foreground },
        '&.MuiSwitch-colorInfo.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.primary[400],
          opacity: 1,
        },
      },
      colorPrimary: {
        '&.Mui-checked': { color: heroui.layout.foreground },
        '&.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.primary[400],
          opacity: 1,
        },
      },
      colorSecondary: {
        '&.Mui-checked': { color: heroui.layout.foreground },
        '&.Mui-checked + .MuiSwitch-track': {
          backgroundColor: heroui.secondary[400],
          opacity: 1,
        },
      },
      thumb: {
        width: 20,
        height: 20,
        backgroundColor: heroui.layout.foreground,
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.02), 0px 2px 10px 0px rgba(0,0,0,0.06), 0px 0px 1px 0px rgba(0,0,0,0.3)',
      },
      track: {
        borderRadius: heroui.radius.full,
        backgroundColor: heroui.default[200],
        opacity: 1,
      },
    },
  },
};
