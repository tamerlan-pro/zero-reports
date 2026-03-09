import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ruRU as muiRuRU, enUS as muiEnUS } from '@mui/material/locale';
import { ruRU as gridRuRU, enUS as gridEnUS } from '@mui/x-data-grid-pro/locales';
import type { ThemeOptions } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { createZeroTheme } from './createZeroTheme.ts';

export interface ZeroThemeProviderProps {
  locale?: 'ru' | 'en';
  colorScheme?: 'dark';
  overrides?: ThemeOptions;
  children: ReactNode;
}

export function ZeroThemeProvider({
  locale = 'ru',
  colorScheme = 'dark',
  overrides,
  children,
}: ZeroThemeProviderProps) {
  const theme = useMemo(() => {
    const base = createZeroTheme({ colorScheme });
    const locales = locale === 'en'
      ? [muiEnUS, gridEnUS]
      : [muiRuRU, gridRuRU];
    return createTheme(base, ...locales, overrides ?? {});
  }, [locale, colorScheme, overrides]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
