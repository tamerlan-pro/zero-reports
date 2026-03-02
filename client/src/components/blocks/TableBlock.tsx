import { Box, Typography, Chip, LinearProgress, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGridPro,
  type GridColDef,
  type GridRowClassNameParams,
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
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import type { TableBlock as TableBlockType, TableColumn } from '../../types/report';

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

function buildColumns(columns: TableColumn[]): GridColDef[] {
  return columns.map((col) => {
    const base: GridColDef = {
      field: col.field,
      headerName: col.headerName,
      width: col.width,
      flex: col.flex,
      type: col.type,
      cellClassName: col.cellClassName,
      headerClassName: col.headerClassName,
      headerAlign: col.headerAlign,
      align: col.align,
    };

    if (col.type === 'number') {
      base.valueFormatter = (value: number) =>
        value != null ? value.toLocaleString('ru-RU') : '';
      if (!col.align) base.align = 'right';
      if (!col.headerAlign) base.headerAlign = 'right';
    }

    if (col.renderAs === 'chip') {
      base.renderCell = (params) => {
        const val = String(params.value || '');
        const color = chipColors[val.toLowerCase()] || 'default';
        return (
          <Chip
            label={val}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      };
    }

    if (col.renderAs === 'progress') {
      base.renderCell = (params) => {
        const val = Number(params.value) || 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
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
          <MuiLink href={val} target="_blank" rel="noopener noreferrer" noWrap>
            {val}
          </MuiLink>
        );
      };
    }

    if (col.renderAs === 'badge') {
      base.renderCell = (params) => {
        const val = params.value;
        return (
          <Chip label={String(val)} size="small" color="primary" />
        );
      };
    }

    return base;
  });
}

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />}>
          <FilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
      <Tooltip title="Export CSV">
        <ExportCsv render={<ToolbarButton />}>
          <FileDownloadIcon fontSize="small" />
        </ExportCsv>
      </Tooltip>
      <Tooltip title="Print">
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Tooltip>

      <StyledQuickFilter expanded>
        <QuickFilterControl
          render={({ ref, ...controlProps }) => (
            <TextField
              {...controlProps}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              sx={{ width: 220 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: controlProps.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
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

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 56;
const TOOLBAR_HEIGHT = 52;
const FOOTER_HEIGHT = 56;

interface Props {
  block: TableBlockType;
}

export function TableBlock({ block }: Props) {
  const columns = buildColumns(block.columns);
  const pageSize = block.pageSize || 10;
  const rowCount = block.rows.length;
  const tableHeight = block.autoHeight
    ? undefined
    : Math.min(rowCount, pageSize) * ROW_HEIGHT + HEADER_HEIGHT + TOOLBAR_HEIGHT + FOOTER_HEIGHT;

  const getRowClassName = block.striped
    ? (params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
    : undefined;

  return (
    <Box>
      {block.title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {block.title}
        </Typography>
      )}
      <Box sx={{ width: '100%', height: tableHeight }}>
        <DataGridPro
          rows={block.rows as Array<Record<string, unknown> & { id: number | string }>}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize } },
            pinnedColumns: block.columnPinning,
          }}
          pagination
          density={block.density}
          showCellVerticalBorder={block.showCellBorders}
          showColumnVerticalBorder={block.showColumnBorders}
          getRowClassName={getRowClassName}
          hideFooter={block.hideFooter}
          columnGroupingModel={block.columnGroups}
          slots={{ toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}
