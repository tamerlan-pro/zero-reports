import type { Components, Theme } from '@mui/material/styles';
import { custom } from '../custom.ts';

export const chartComponents: Components<Theme> = {
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme: t }) => ({
        '& .MuiChartsAxis-tickLabel': {
          fill: t.palette.text.secondary,
          fontSize: t.heroui.typography.tiny.fontSize,
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
          fontSize: t.heroui.typography.small.fontSize,
        },
      }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      paper: ({ theme: t }) => ({
        background: t.custom.surface.card.background,
        border: t.custom.surface.card.border,
        boxShadow: t.custom.surface.card.shadow,
        borderRadius: t.heroui.radius.small,
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
  MuiLineElement: {
    styleOverrides: {
      root: {
        strokeWidth: custom.chart.lineStrokeWidth,
      },
    },
  },
  MuiBarElement: {
    styleOverrides: {
      root: {
        rx: custom.chart.barBorderRadius,
        ry: custom.chart.barBorderRadius,
      },
    },
  },
};
