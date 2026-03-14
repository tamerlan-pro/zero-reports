import { z } from 'zod';
import { LocalizedStringSchema } from './blocks/common';
import { HeadingBlockSchema } from './blocks/heading';
import { MarkdownBlockSchema } from './blocks/markdown';
import { MetricsBlockSchema } from './blocks/metrics';
import { ChartBlockSchema } from './blocks/chart';
import { TableBlockSchema } from './blocks/table';
import { DividerBlockSchema } from './blocks/divider';
import { CalloutBlockSchema } from './blocks/callout';
import { UIShowcaseBlockSchema } from './blocks/uiShowcase';

export const SCHEMA_VERSION = 1;

// --- Interactive blocks (defined here to support recursive ReportBlock reference) ---

export const FilterOptionSchema = z.object({
  value: z.string(),
  label: LocalizedStringSchema,
});

export const FilterBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('filter'),
  filterId: z.string().min(1),
  label: LocalizedStringSchema,
  filterType: z.enum(['select', 'multiselect', 'dateRange', 'search']),
  options: z.array(FilterOptionSchema).optional(),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  targetBlockIds: z.array(z.string()).min(1),
});

// Recursive block types use z.lazy()
const BaseBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  MarkdownBlockSchema,
  MetricsBlockSchema,
  ChartBlockSchema,
  TableBlockSchema,
  DividerBlockSchema,
  CalloutBlockSchema,
  UIShowcaseBlockSchema,
  FilterBlockSchema,
]);

export type BaseBlock = z.infer<typeof BaseBlockSchema>;

// Forward declarations for recursive types
export interface TabItem {
  id: string;
  label: z.infer<typeof LocalizedStringSchema>;
  icon?: string;
  blocks: ReportBlock[];
}

export interface TabsBlock {
  id?: string;
  type: 'tabs';
  defaultTab?: string;
  tabs: TabItem[];
}

export interface GridBlock {
  id?: string;
  type: 'grid';
  columns: number;
  gap?: number;
  blocks: ReportBlock[];
}

export interface DynamicDataBlock {
  id?: string;
  type: 'dynamicData';
  dataSourceUrl: string;
  refreshInterval?: number;
  blocks: ReportBlock[];
}

export interface FilterBarBlock {
  id?: string;
  type: 'filterBar';
  /** MUI spacing units gap between filter items. Default: 2 */
  gap?: number;
  blocks: FilterBlock[];
}

export type ReportBlock =
  | BaseBlock
  | TabsBlock
  | GridBlock
  | DynamicDataBlock
  | FilterBarBlock;

// ---------------------------------------------------------------------------
// Block tree traversal — single source of truth
// ---------------------------------------------------------------------------

export interface ChildBlockGroup {
  blocks: ReportBlock[];
  containerType: string;
}

/**
 * Single source of truth for extracting child blocks from any container block.
 * When adding a new container block type, update ONLY this function —
 * all tree traversal utilities (extractFilterDefs, extractSearchItems,
 * extractTocItems, walkBlocks, walkLevels) will automatically pick it up.
 */
export function getChildBlocks(block: ReportBlock): ChildBlockGroup[] {
  switch (block.type) {
    case 'grid':
    case 'dynamicData':
    case 'filterBar':
      return [{ blocks: block.blocks as ReportBlock[], containerType: block.type }];
    case 'tabs':
      return block.tabs.map((tab) => ({
        blocks: tab.blocks,
        containerType: 'tabs',
      }));
    default:
      return [];
  }
}

// Runtime Zod schemas for recursive types
export const ReportBlockSchema: z.ZodType<ReportBlock> = z.lazy(() =>
  z.union([
    BaseBlockSchema,
    z.object({
      id: z.string().optional(),
      type: z.literal('tabs'),
      defaultTab: z.string().optional(),
      tabs: z.array(
        z.object({
          id: z.string(),
          label: LocalizedStringSchema,
          icon: z.string().optional(),
          blocks: z.array(ReportBlockSchema),
        }),
      ).min(1),
    }),
    z.object({
      id: z.string().optional(),
      type: z.literal('grid'),
      columns: z.number().int().min(1).max(12),
      gap: z.number().optional(),
      blocks: z.array(ReportBlockSchema),
    }),
    z.object({
      id: z.string().optional(),
      type: z.literal('dynamicData'),
      dataSourceUrl: z.string().url(),
      refreshInterval: z.number().int().nonnegative().optional(),
      blocks: z.array(ReportBlockSchema),
    }),
    z.object({
      id: z.string().optional(),
      type: z.literal('filterBar'),
      gap: z.number().optional(),
      blocks: z.array(FilterBlockSchema).min(1),
    }),
  ]),
);

export const DataBindingSchema = z.object({
  sourceBlockId: z.string(),
  sourceField: z.string(),
  targetBlockId: z.string(),
  targetFilter: z.string(),
});

export const ReportConfigSchema = z.object({
  schemaVersion: z.number().int().positive().optional().default(SCHEMA_VERSION),
  blocks: z.array(ReportBlockSchema),
  dataBindings: z.array(DataBindingSchema).optional(),
});

export type FilterOption = z.infer<typeof FilterOptionSchema>;
export type FilterBlock = z.infer<typeof FilterBlockSchema>;
export type DataBinding = z.infer<typeof DataBindingSchema>;
export type ReportConfig = z.infer<typeof ReportConfigSchema>;

export interface Report {
  title: z.infer<typeof LocalizedStringSchema>;
  description?: z.infer<typeof LocalizedStringSchema>;
  config: ReportConfig;
  createdAt: string;
}

export interface ReportListItem {
  id: string;
  slug: string;
  token: string;
  title: z.infer<typeof LocalizedStringSchema>;
  description?: z.infer<typeof LocalizedStringSchema>;
  createdAt: string;
  updatedAt: string;
}

export const CreateReportInputSchema = z.object({
  slug: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/, 'slug must contain only lowercase letters, digits and hyphens'),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  config: ReportConfigSchema,
  isPublished: z.boolean().optional().default(true),
});

export type CreateReportInput = z.infer<typeof CreateReportInputSchema>;
