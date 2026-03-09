import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { custom } from '../custom.ts';
import { BG_PAPER } from '../palette.ts';

export const dataGridComponents: Components<Theme> = {
  MuiDataGrid: {
    defaultProps: {
      disableRowSelectionOnClick: true,
      showToolbar: true,
      pageSizeOptions: [10, 25, 50, 100],
      density: 'standard',
      rowHeight: custom.dataGrid.rowHeight,
      columnHeaderHeight: custom.dataGrid.headerHeight,
    },
    styleOverrides: {
      root: ({ theme: t }) => ({
        '--DataGrid-t-color-border-base': 'rgba(43, 43, 45, 0.8) !important',
        borderRadius: t.shape.borderRadius,
        fontVariantNumeric: 'tabular-nums',
        border: t.custom.surface.card.border,
        background: t.custom.surface.card.background,
        boxShadow: t.custom.surface.card.shadow,
        '& .MuiDataGrid-sortIcon': {
          color: t.palette.primary.main,
        },
      }),
      toolbarContainer: ({ theme: t }) => ({
        padding: t.spacing(1.5),
        gap: t.spacing(0.5),
        backgroundColor: 'transparent',
        borderBottom: t.custom.surface.card.border,
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
        display: 'flex',
        alignItems: 'center',
        borderBottom: 'none',
        fontSize: '0.875rem',
      },
      footerContainer: ({ theme: t }) => ({
        borderTop: t.custom.surface.card.border,
        '& .MuiTablePagination-root': {
          color: t.palette.text.secondary,
        },
      }),
      panel: ({ theme: t }) => ({
        '& .MuiPaper-root': {
          background: t.custom.surface.card.background,
          border: t.custom.surface.card.border,
        },
      }),
      menu: ({ theme: t }) => ({
        '& .MuiPaper-root': {
          background: t.custom.surface.card.background,
        },
      }),
      overlay: ({ theme: t }) => ({
        backgroundColor: alpha(BG_PAPER, 0.8),
        color: t.palette.text.secondary,
      }),
    },
  },
};
