import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const TableColumnSchema = z.object({
  field: z.string(),
  headerName: LocalizedStringSchema,
  width: z.number().int().positive().optional(),
  flex: z.number().optional(),
  type: z.enum(['string', 'number', 'date', 'boolean']).optional(),
  renderAs: z.enum(['chip', 'progress', 'link', 'badge']).optional(),
  cellClassName: z.string().optional(),
  headerClassName: z.string().optional(),
  headerAlign: z.enum(['left', 'center', 'right']).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
});

export const TableBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('table'),
  title: LocalizedStringSchema.optional(),
  pageSize: z.number().int().positive().optional(),
  columns: z.array(TableColumnSchema).min(1),
  rows: z.array(z.record(z.string(), z.unknown())),
  density: z.enum(['compact', 'standard', 'comfortable']).optional(),
  showCellBorders: z.boolean().optional(),
  showColumnBorders: z.boolean().optional(),
  striped: z.boolean().optional(),
  headerFilters: z.boolean().optional(),
  columnPinning: z.object({
    left: z.array(z.string()).optional(),
    right: z.array(z.string()).optional(),
  }).optional(),
  columnGroups: z.array(z.object({
    groupId: z.string(),
    headerName: LocalizedStringSchema,
    children: z.array(z.object({ field: z.string() })),
  })).optional(),
  autoHeight: z.boolean().optional(),
  hideFooter: z.boolean().optional(),
});

export type TableColumn = z.infer<typeof TableColumnSchema>;
export type TableBlock = z.infer<typeof TableBlockSchema>;
