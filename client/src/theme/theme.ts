import { createTheme, alpha } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-charts-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

// ---------------------------------------------------------------------------
// HeroUI Dark Colors — full palette from Figma Kit
// https://www.figma.com/design/b0WNgdIvU6J0ZjcCBg4wzV — node 276:20189
// ---------------------------------------------------------------------------

type ColorScale = {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string;
};

interface HeroUIColors {
  layout: { background: string; foreground: string; divider: string; focus: string };
  content: { 1: string; 2: string; 3: string; 4: string };
  default: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
}

export const heroui: HeroUIColors = {
  layout: {
    background: '#000000',
    foreground: '#ECEDEE',
    divider: 'rgba(255,255,255,0.15)',
    focus: '#006FEE',
  },
  content: {
    1: '#18181B',
    2: '#27272A',
    3: '#3F3F46',
    4: '#52525B',
  },
  default: {
    50:  '#18181B', 100: '#27272A', 200: '#3F3F46', 300: '#52525B', 400: '#71717A',
    500: '#A1A1AA', 600: '#D4D4D8', 700: '#E4E4E7', 800: '#F4F4F5', 900: '#FAFAFA',
  },
  primary: {
    50:  '#001731', 100: '#002E62', 200: '#004493', 300: '#005BC4', 400: '#006FEE',
    500: '#338EF7', 600: '#66AAF9', 700: '#99C7FB', 800: '#CCE3FD', 900: '#E6F1FE',
  },
  secondary: {
    50:  '#180828', 100: '#301050', 200: '#481878', 300: '#6020A0', 400: '#7828C8',
    500: '#9353D3', 600: '#AE7EDE', 700: '#C9A9E9', 800: '#E4D4F4', 900: '#F2EAFA',
  },
  success: {
    50:  '#052814', 100: '#095028', 200: '#0E793C', 300: '#12A150', 400: '#17C964',
    500: '#45D483', 600: '#74DFA2', 700: '#A2E9C1', 800: '#D1F4E0', 900: '#E8FAF0',
  },
  warning: {
    50:  '#312107', 100: '#62420E', 200: '#936316', 300: '#C4841D', 400: '#F5A524',
    500: '#F7B750', 600: '#F9C97C', 700: '#FBDBA7', 800: '#FDEDD3', 900: '#FEFCE8',
  },
  danger: {
    50:  '#310413', 100: '#610726', 200: '#920B3A', 300: '#C20E4D', 400: '#F31260',
    500: '#F54180', 600: '#F871A0', 700: '#FAA0BF', 800: '#FDD0DF', 900: '#FEE7EF',
  },
};

// ---------------------------------------------------------------------------
// MUI type augmentation
// ---------------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
      level6: string;
      level7: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      level5?: string;
      level6?: string;
      level7?: string;
    };
  }
  interface TypeText {
    caption: string;
  }
  interface Theme {
    heroui: HeroUIColors;
    custom: {
      chartColors: string[];
      chartColorPairs: Record<string, string>;
      iconOpacity: {
        emptyState: number;
        muted: number;
      };
    };
  }
  interface ThemeOptions {
    heroui?: HeroUIColors;
    custom?: {
      chartColors?: string[];
      chartColorPairs?: Record<string, string>;
      iconOpacity?: {
        emptyState?: number;
        muted?: number;
      };
    };
  }
}

const BG_DEFAULT = heroui.layout.background;
const BG_PAPER = heroui.content[1];

const theme = createTheme({
  heroui,
  custom: {
    // System convention: all charts default to vibrant 400-weight HeroUI colors.
    // Bar charts apply a tonal gradient (400 → 200), pie/donut charts use a
    // radial gradient (400 center → 200 edge), line areas use a fade gradient.
    // Reports may override individual colors via semantic tokens (see resolveColor).
    chartColors: [
      heroui.primary[400],
      heroui.success[400],
      heroui.warning[400],
      heroui.danger[400],
      '#06B7DB',
      heroui.secondary[400],
    ],
    // Maps each bright (400) color to its dark (200) counterpart for gradients.
    chartColorPairs: {
      [heroui.primary[400]]: heroui.primary[200],
      [heroui.secondary[400]]: heroui.secondary[200],
      [heroui.success[400]]: heroui.success[200],
      [heroui.warning[400]]: heroui.warning[200],
      [heroui.danger[400]]: heroui.danger[200],
      '#06B7DB': '#065F73',
    } as Record<string, string>,
    iconOpacity: {
      emptyState: 0.4,
      muted: 0.7,
    },
  },
  palette: {
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
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.938rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.813rem', fontWeight: 400, color: heroui.default[400] },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
            '&:hover': {
              background: 'rgba(255,255,255,0.25)',
            },
          },
        },
        '*': {
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
            '&:hover': {
              background: 'rgba(255,255,255,0.25)',
            },
          },
        },
      },
    },
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
          borderRadius: 12,
          textTransform: 'none' as const,
          fontWeight: 500,
        },
        outlined: ({ theme: t }) => ({
          borderColor: t.palette.surface.level5,
          '&:hover': {
            borderColor: t.palette.primary.main,
            backgroundColor: alpha(t.palette.primary.main, 0.08),
          },
        }),
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
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          '&:not(.MuiAlert-root)': {
            background: 'linear-gradient(to bottom, #131315, #070809)',
            border: '0.5px solid rgba(43, 43, 45, 0.8)',
            boxShadow: '0px 4px 10px 0px rgba(105, 104, 104, 0.25)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundImage: 'none',
          backgroundColor: alpha(t.palette.background.default, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${t.palette.surface.level3}`,
          boxShadow: 'none',
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme: t }) => ({
          background: 'linear-gradient(to bottom, #131315, #070809)',
          border: '0.5px solid rgba(43, 43, 45, 0.8)',
          boxShadow: '0px 4px 10px 0px rgba(105, 104, 104, 0.25)',
          borderRadius: 8,
          fontSize: '0.813rem',
          color: t.palette.text.primary,
        }),
        arrow: {
          color: '#070809',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.813rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: heroui.default[100],
          borderRadius: 12,
          padding: 4,
          minHeight: 'auto',
        },
        flexContainer: {
          gap: 8,
        },
        indicator: {
          display: 'none',
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
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: '20px',
          textTransform: 'none' as const,
          color: heroui.default[500],
          transition: 'background-color 0.2s, color 0.2s',
          '&.Mui-selected': {
            backgroundColor: heroui.default[200],
            color: '#fff',
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
          },
          '&:hover:not(.Mui-selected)': {
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: heroui.default[600],
          },
          '&.Mui-disabled': {
            color: heroui.default[300],
            opacity: 0.5,
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
          fontSize: '0.875rem',
          lineHeight: 1.43,
          border: 'none',

          // Secondary color (color="secondary" prop) — not a typed compound slot,
          // so we target via CSS class selectors generated by useUtilityClasses.
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

          // Default color (color="inherit" / neutral)
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

        // Standard (flat) — compound slots resolved LAST by overridesResolver
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

        // Outlined
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

        // Filled
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
    MuiSkeleton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundColor: t.palette.surface.level3,
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

    // MUI X Charts overrides
    MuiChartsAxis: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          '& .MuiChartsAxis-tickLabel': {
            fill: t.palette.text.secondary,
            fontSize: '0.75rem',
          },
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
            stroke: t.palette.surface.level5,
          },
        }),
      },
    },
    MuiChartsGrid: {
      styleOverrides: {
        line: ({ theme: t }) => ({
          stroke: t.palette.surface.level3,
          strokeDasharray: '3 3',
        }),
      },
    },
    MuiChartsLegend: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          '& .MuiChartsLegend-label': {
            fill: t.palette.text.secondary,
            fontSize: '0.813rem',
          },
        }),
      },
    },
    MuiChartsTooltip: {
      styleOverrides: {
        paper: () => ({
          background: 'linear-gradient(to bottom, #131315, #070809)',
          border: '0.5px solid rgba(43, 43, 45, 0.8)',
          boxShadow: '0px 4px 10px 0px rgba(105, 104, 104, 0.25)',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
        }),
      },
    },
    MuiAreaElement: {
      styleOverrides: {
        root: {
          fillOpacity: 1,
        },
      },
    },

    // MUI X DataGrid overrides
    MuiDataGrid: {
      defaultProps: {
        disableRowSelectionOnClick: true,
        showToolbar: true,
        pageSizeOptions: [10, 25, 50, 100],
        density: 'standard',
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          '--DataGrid-t-color-border-base': 'rgba(43, 43, 45, 0.8) !important',
          borderRadius: t.shape.borderRadius,
          fontVariantNumeric: 'tabular-nums',
          border: '0.5px solid rgba(43, 43, 45, 0.8)',
          background: 'linear-gradient(to bottom, #131315, #070809)',
          boxShadow: '0px 4px 10px 0px rgba(105, 104, 104, 0.25)',
          '& .MuiDataGrid-sortIcon': {
            color: t.palette.primary.main,
          },
        }),
        toolbarContainer: ({ theme: t }) => ({
          padding: t.spacing(1.5),
          gap: t.spacing(0.5),
          backgroundColor: 'transparent',
          borderBottom: '0.5px solid rgba(43, 43, 45, 0.8)',
          '& .MuiButtonBase-root': {
            color: t.palette.text.secondary,
            '&:hover': {
              color: t.palette.text.primary,
              backgroundColor: t.palette.surface.level3,
            },
          },
        }),
        columnHeaders: () => ({
          backgroundColor: 'transparent',
        }),
        columnHeaderTitle: {
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        },
        row: ({ theme: t }) => ({
          '&:nth-of-type(even)': {
            backgroundColor: t.palette.surface.level1,
          },
          '&:hover': {
            backgroundColor: `${t.palette.surface.level2} !important`,
          },
          '&.Mui-selected': {
            backgroundColor: alpha(t.palette.primary.main, 0.15),
            '&:hover': {
              backgroundColor: `${alpha(t.palette.primary.main, 0.25)} !important`,
            },
          },
        }),
        cell: {
          borderBottom: 'none',
          fontSize: '0.875rem',
        },
        footerContainer: ({ theme: t }) => ({
          borderTop: '0.5px solid rgba(43, 43, 45, 0.8)',
          '& .MuiTablePagination-root': {
            color: t.palette.text.secondary,
          },
        }),
        panel: () => ({
          '& .MuiPaper-root': {
            background: 'linear-gradient(to bottom, #131315, #070809)',
            border: '0.5px solid rgba(43, 43, 45, 0.8)',
          },
        }),
        menu: () => ({
          '& .MuiPaper-root': {
            background: 'linear-gradient(to bottom, #131315, #070809)',
          },
        }),
        overlay: ({ theme: t }) => ({
          backgroundColor: alpha(BG_PAPER, 0.8),
          color: t.palette.text.secondary,
        }),
      },
    },
  },
});

export default theme;
