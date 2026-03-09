import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';

export const inputComponents: Components<Theme> = {
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: t.palette.surface.level3,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: t.palette.surface.level5,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: t.palette.primary.main,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        borderRadius: 4,
        height: 6,
        backgroundColor: t.palette.surface.level3,
      }),
      bar: {
        borderRadius: 4,
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        color: t.palette.primary.light,
        textDecorationColor: alpha(t.palette.primary.light, 0.4),
        '&:hover': {
          textDecorationColor: t.palette.primary.light,
        },
      }),
    },
  },
};
