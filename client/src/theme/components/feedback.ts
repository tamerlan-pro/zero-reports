import type { Components, Theme } from '@mui/material/styles';
import { heroui } from '../tokens/colors.ts';

export const feedbackComponents: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        minHeight: '100vh',
        scrollbarColor: 'rgba(255,255,255,0.15) transparent',
        '&::-webkit-scrollbar': { width: 8, height: 8 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 4,
          '&:hover': { background: 'rgba(255,255,255,0.25)' },
        },
      },
      '*': {
        scrollbarColor: 'rgba(255,255,255,0.15) transparent',
        '&::-webkit-scrollbar': { width: 8, height: 8 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 4,
          '&:hover': { background: 'rgba(255,255,255,0.25)' },
        },
      },
    },
  },
  MuiAlert: {
    defaultProps: { variant: 'standard' },
    styleOverrides: {
      root: {
        borderRadius: 16,
        padding: '12px 16px',
        alignItems: 'center',
        fontSize: heroui.typography.small.fontSize,
        lineHeight: 1.43,
        border: 'none',
        '&.MuiAlert-standardSecondary': {
          background: heroui.secondary[50],
          color: heroui.secondary[400],
          '& .MuiAlert-icon': { color: heroui.secondary[400] },
          '& .MuiAlertTitle-root': { color: heroui.secondary[400] },
        },
        '&.MuiAlert-outlinedSecondary': {
          background: heroui.secondary[50],
          border: `1px solid ${heroui.secondary[400]}`,
          color: heroui.secondary[400],
          '& .MuiAlert-icon': { color: heroui.secondary[400] },
          '& .MuiAlertTitle-root': { color: heroui.secondary[400] },
        },
        '&.MuiAlert-filledSecondary': {
          background: heroui.secondary[400],
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
          '& .MuiAlertTitle-root': { color: '#fff' },
        },
        '&.MuiAlert-standardDefault': {
          background: heroui.default[100],
          color: heroui.layout.foreground,
          '& .MuiAlert-icon': { color: heroui.default[500] },
          '& .MuiAlertTitle-root': { color: heroui.layout.foreground },
        },
        '&.MuiAlert-outlinedDefault': {
          background: heroui.default[100],
          border: `1px solid ${heroui.default[300]}`,
          color: heroui.layout.foreground,
          '& .MuiAlert-icon': { color: heroui.default[500] },
          '& .MuiAlertTitle-root': { color: heroui.layout.foreground },
        },
        '&.MuiAlert-filledDefault': {
          background: heroui.default[300],
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
          '& .MuiAlertTitle-root': { color: '#fff' },
        },
      },
      icon: { padding: 0, marginRight: 12, alignItems: 'center' },
      message: { padding: 0, fontWeight: 400 },
      action: { padding: 0, marginRight: 0, alignItems: 'center' },
      standardInfo: {
        background: heroui.primary[50],
        color: heroui.primary[400],
        '& .MuiAlert-icon': { color: heroui.primary[400] },
        '& .MuiAlertTitle-root': { color: heroui.primary[400] },
      },
      standardSuccess: {
        background: heroui.success[50],
        color: heroui.success[400],
        '& .MuiAlert-icon': { color: heroui.success[400] },
        '& .MuiAlertTitle-root': { color: heroui.success[400] },
      },
      standardWarning: {
        background: heroui.warning[50],
        color: '#fff',
        '& .MuiAlert-icon': { color: heroui.warning[400] },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      standardError: {
        background: heroui.danger[50],
        color: '#fff',
        '& .MuiAlert-icon': { color: heroui.danger[400] },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      outlinedInfo: {
        background: heroui.primary[50],
        border: `1px solid ${heroui.primary[400]}`,
        color: heroui.primary[400],
        '& .MuiAlert-icon': { color: heroui.primary[400] },
        '& .MuiAlertTitle-root': { color: heroui.primary[400] },
      },
      outlinedSuccess: {
        background: heroui.success[50],
        border: `1px solid ${heroui.success[400]}`,
        color: heroui.success[400],
        '& .MuiAlert-icon': { color: heroui.success[400] },
        '& .MuiAlertTitle-root': { color: heroui.success[400] },
      },
      outlinedWarning: {
        background: heroui.warning[50],
        border: `1px solid ${heroui.warning[400]}`,
        color: '#fff',
        '& .MuiAlert-icon': { color: heroui.warning[400] },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      outlinedError: {
        background: heroui.danger[50],
        border: `1px solid ${heroui.danger[400]}`,
        color: '#fff',
        '& .MuiAlert-icon': { color: heroui.danger[400] },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      filledInfo: {
        background: heroui.primary[400],
        color: '#fff',
        '& .MuiAlert-icon': { color: '#fff' },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      filledSuccess: {
        background: heroui.success[400],
        color: '#fff',
        '& .MuiAlert-icon': { color: '#fff' },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      filledWarning: {
        background: heroui.warning[400],
        color: '#fff',
        '& .MuiAlert-icon': { color: '#fff' },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
      filledError: {
        background: heroui.danger[400],
        color: '#fff',
        '& .MuiAlert-icon': { color: '#fff' },
        '& .MuiAlertTitle-root': { color: '#fff' },
      },
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        marginBottom: 0,
        lineHeight: '1.25rem',
      },
    },
  },
};
