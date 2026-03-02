import { createTheme, alpha } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-charts-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

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
    custom: {
      chartColors: string[];
      iconOpacity: {
        emptyState: number;
        muted: number;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      chartColors?: string[];
      iconOpacity?: {
        emptyState?: number;
        muted?: number;
      };
    };
  }
}

const BG_DEFAULT = '#0a0e14';
const BG_PAPER = '#111820';

const theme = createTheme({
  custom: {
    chartColors: [
      '#42a5f5',
      '#ab47bc',
      '#66bb6a',
      '#ffa726',
      '#ef5350',
      '#26c6da',
    ],
    iconOpacity: {
      emptyState: 0.4,
      muted: 0.7,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: BG_DEFAULT,
      paper: BG_PAPER,
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726',
    },
    error: {
      main: '#ef5350',
    },
    info: {
      main: '#42a5f5',
    },
    surface: {
      level1: 'rgba(255,255,255,0.02)',
      level2: 'rgba(255,255,255,0.04)',
      level3: 'rgba(255,255,255,0.06)',
      level4: 'rgba(255,255,255,0.08)',
      level5: 'rgba(255,255,255,0.1)',
      level6: 'rgba(255,255,255,0.12)',
      level7: 'rgba(255,255,255,0.15)',
    },
    divider: 'rgba(255,255,255,0.06)',
    text: {
      primary: 'rgba(255,255,255,0.87)',
      secondary: 'rgba(255,255,255,0.6)',
      caption: 'rgba(255,255,255,0.3)',
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
    caption: { fontSize: '0.813rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Base MUI overrides
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `linear-gradient(180deg, ${BG_DEFAULT} 0%, #0d1117 100%)`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundImage: 'none',
          border: `1px solid ${t.palette.surface.level3}`,
          boxShadow: `0 1px 3px rgba(0,0,0,0.3), 0 0 1px ${t.palette.surface.level2}`,
        }),
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.813rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: t.shape.borderRadius,
          border: `1px solid ${t.palette.surface.level3}`,
        }),
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundColor: t.palette.surface.level3,
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
        paper: ({ theme: t }) => ({
          backgroundColor: alpha(t.palette.background.paper, 0.95),
          border: `1px solid ${t.palette.surface.level5}`,
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
        }),
      },
    },
    MuiAreaElement: {
      styleOverrides: {
        root: {
          opacity: 0.15,
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
          '--DataGrid-t-color-border-base': `${t.palette.surface.level3} !important`,
          borderRadius: t.shape.borderRadius,
          fontVariantNumeric: 'tabular-nums',
        }),
        toolbarContainer: ({ theme: t }) => ({
          padding: t.spacing(1.5),
          gap: t.spacing(0.5),
          backgroundColor: t.palette.surface.level1,
          '& .MuiButtonBase-root': {
            color: t.palette.text.secondary,
            '&:hover': {
              color: t.palette.text.primary,
              backgroundColor: t.palette.surface.level3,
            },
          },
        }),
        columnHeaders: ({ theme: t }) => ({
          backgroundColor: t.palette.surface.level1,
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
            backgroundColor: t.palette.surface.level2,
          },
        }),
        cell: {
          borderBottom: 'none',
          fontSize: '0.875rem',
        },
        footerContainer: {
          borderTop: 'none',
        },
      },
    },
  },
});

export default theme;
