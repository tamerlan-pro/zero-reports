import { Box, Typography, Chip, LinearProgress, Link as MuiLink } from '@mui/material';
import { BlockTitle } from './shared/BlockTitle';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  DataGridPro,
  type GridColDef,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ExportCsv,
  ExportPrint,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
} from '@mui/x-data-grid-pro';
import { Icon } from '@iconify/react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import type { TableBlock as TableBlockType, TableColumn } from '../../types/report';
import { resolveLocale } from '../../utils/locale';
import { useReportFilters, applyFilters } from '../../context/ReportFilterContext';

const chipColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  active: 'success',
  completed: 'success',
  done: 'success',
  pending: 'warning',
  waiting: 'warning',
  review: 'warning',
  error: 'error',
  failed: 'error',
  cancelled: 'error',
  inactive: 'default',
  draft: 'default',
  new: 'info',
  info: 'info',
};

const StyledQuickFilter = styled(QuickFilter)({
  marginLeft: 'auto',
});

function buildColumns(columns: TableColumn[], lang: string): GridColDef[] {
  return columns.map((col) => {
    const base: GridColDef = {
      field: col.field,
      headerName: resolveLocale(col.headerName, lang),
      width: col.width,
      flex: col.flex,
      type: col.type,
      cellClassName: col.cellClassName,
      headerClassName: col.headerClassName,
      headerAlign: col.headerAlign,
      align: col.align,
    };

    if (col.type === 'number') {
      const numLocale = lang === 'en' ? 'en-US' : 'ru-RU';
      base.valueFormatter = (value: number) =>
        value != null ? value.toLocaleString(numLocale) : '';
      if (!col.align) base.align = 'right';
      if (!col.headerAlign) base.headerAlign = 'right';
    }

    if (col.renderAs === 'chip') {
      base.renderCell = (params) => {
        const val = String(params.value || '');
        const color = chipColors[val.toLowerCase()] || 'default';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
            <Chip
              label={val}
              color={color}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        );
      };
    }

    if (col.renderAs === 'progress') {
      base.renderCell = (params) => {
        const val = Number(params.value) || 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', height: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(val, 100)}
              sx={{ flex: 1, height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption">{val}%</Typography>
          </Box>
        );
      };
    }

    if (col.renderAs === 'link') {
      base.renderCell = (params) => {
        const val = String(params.value || '');
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
            <MuiLink href={val} target="_blank" rel="noopener noreferrer" noWrap>
              {val}
            </MuiLink>
          </Box>
        );
      };
    }

    if (col.renderAs === 'badge') {
      base.renderCell = (params) => {
        const val = params.value;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
            <Chip label={String(val)} size="small" color="primary" />
          </Box>
        );
      };
    }

    return base;
  });
}

function CustomToolbar() {
  const { t } = useTranslation();
  return (
    <Toolbar>
      <Tooltip title={t('common.columns')}>
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <Icon icon="solar:tuning-2-bold-duotone" width={18} />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title={t('common.filters')}>
        <FilterPanelTrigger render={<ToolbarButton />}>
          <Icon icon="solar:filter-bold-duotone" width={18} />
        </FilterPanelTrigger>
      </Tooltip>
      <Tooltip title={t('common.exportCsv')}>
        <ExportCsv render={<ToolbarButton />}>
          <Icon icon="solar:file-download-bold-duotone" width={18} />
        </ExportCsv>
      </Tooltip>
      <Tooltip title={t('common.print')}>
        <ExportPrint render={<ToolbarButton />}>
          <Icon icon="solar:printer-bold-duotone" width={18} />
        </ExportPrint>
      </Tooltip>

      <StyledQuickFilter expanded>
        <QuickFilterControl
          render={({ ref, ...controlProps }) => (
            <TextField
              {...controlProps}
              inputRef={ref}
              aria-label={t('common.search')}
              placeholder={t('common.search')}
              size="small"
              sx={{ width: 220 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="solar:magnifer-bold-duotone" width={18} />
                    </InputAdornment>
                  ),
                  endAdornment: controlProps.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label={t('common.clearSearch')}
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <Icon icon="solar:close-circle-bold-duotone" width={18} />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

// These match theme.custom.dataGrid values — kept in sync via custom tokens
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;
const TOOLBAR_HEIGHT = 52;
const FOOTER_HEIGHT = 56;

interface Props {
  block: TableBlockType;
}

export function TableBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { filters, filterDefs } = useReportFilters();
  const filteredRows = block.id
    ? applyFilters(block.rows as Record<string, unknown>[], filters, block.id, filterDefs)
    : block.rows;
  const columns = buildColumns(block.columns, lang);
  const pageSize = block.pageSize || 10;
  const rowCount = filteredRows.length;

  const tableHeight = block.autoHeight
    ? undefined
    : Math.min(rowCount, pageSize) * ROW_HEIGHT + HEADER_HEIGHT + TOOLBAR_HEIGHT + FOOTER_HEIGHT;

  // Striped rows are handled by MuiDataGrid.row theme override (nth-of-type(even)).
  // No custom getRowClassName needed — the theme does it globally.

  return (
    <Box>
      {block.title && (
        <BlockTitle>{resolveLocale(block.title, lang)}</BlockTitle>
      )}
      <Box sx={{ width: '100%', height: tableHeight }}>
        <DataGridPro
          rows={filteredRows as Array<Record<string, unknown> & { id: number | string }>}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize } },
            pinnedColumns: block.columnPinning,
          }}
          pagination
          showCellVerticalBorder={block.showCellBorders}
          showColumnVerticalBorder={block.showColumnBorders}
          hideFooter={block.hideFooter}
          columnGroupingModel={block.columnGroups?.map((g) => ({
            ...g,
            headerName: resolveLocale(g.headerName, lang),
          }))}
          slots={{ toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}
