// Common
export type { LocalizedString } from './blocks/common';
export { LocalizedStringSchema } from './blocks/common';

// Individual block schemas and types
export { HeadingBlockSchema } from './blocks/heading';
export type { HeadingBlock } from './blocks/heading';

export { MarkdownBlockSchema } from './blocks/markdown';
export type { MarkdownBlock } from './blocks/markdown';

export { MetricsBlockSchema, MetricItemSchema } from './blocks/metrics';
export type { MetricsBlock, MetricItem } from './blocks/metrics';

export { ChartBlockSchema, ChartSeriesSchema, ChartAxisSchema } from './blocks/chart';
export type { ChartBlock, ChartSeries, ChartAxis } from './blocks/chart';

export { TableBlockSchema, TableColumnSchema } from './blocks/table';
export type { TableBlock, TableColumn } from './blocks/table';

export { DividerBlockSchema } from './blocks/divider';
export type { DividerBlock } from './blocks/divider';

export { CalloutBlockSchema } from './blocks/callout';
export type { CalloutBlock } from './blocks/callout';

export { UIShowcaseBlockSchema } from './blocks/uiShowcase';
export type { UIShowcaseBlock } from './blocks/uiShowcase';

// Report-level schemas and types (includes interactive blocks)
export {
  SCHEMA_VERSION,
  FilterBlockSchema,
  FilterOptionSchema,
  ReportBlockSchema,
  ReportConfigSchema,
  DataBindingSchema,
  CreateReportInputSchema,
} from './report';

export type {
  FilterBlock,
  FilterOption,
  TabsBlock,
  TabItem,
  GridBlock,
  DynamicDataBlock,
  FilterBarBlock,
  ReportBlock,
  ReportConfig,
  DataBinding,
  Report,
  ReportListItem,
  CreateReportInput,
  BaseBlock,
  ChildBlockGroup,
} from './report';

export { getChildBlocks } from './report';

// Migrations
export { migrateConfig } from './migrations/index';
