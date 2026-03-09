import type { LocalizedString } from '../utils/locale';

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: LocalizedString;
  subtitle?: LocalizedString;
}

export interface MarkdownBlock {
  type: 'markdown';
  content: LocalizedString;
}

export interface MetricItem {
  label: LocalizedString;
  value: string | number;
  delta?: LocalizedString;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  /** Semantic token ("primary", "danger", "success.400"), hex ("#006FEE"), or omit for theme default */
  color?: string;
}

export interface MetricsBlock {
  type: 'metrics';
  columns?: number;
  items: MetricItem[];
}

export interface ChartSeries {
  dataKey: string;
  label?: LocalizedString;
  /** Semantic token ("primary", "danger", "success.400"), hex ("#006FEE"), or omit for theme default */
  color?: string;
  area?: boolean;
}

export interface ChartAxis {
  dataKey: string;
  label?: LocalizedString;
  scaleType?: 'band' | 'linear' | 'log' | 'point' | 'pow' | 'sqrt' | 'time' | 'utc';
}

export interface RadarMetric {
  name: LocalizedString;
  min?: number;
  max?: number;
}

export interface ChartBlock {
  type: 'chart';
  title?: LocalizedString;
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'gauge' | 'sparkline' | 'radar' | 'funnel' | 'heatmap';
  height?: number;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  series: ChartSeries[];
  data: Record<string, unknown>[];

  // Gauge
  gaugeValue?: number;
  gaugeMin?: number;
  gaugeMax?: number;
  gaugeStartAngle?: number;
  gaugeEndAngle?: number;

  // SparkLine
  sparklineData?: number[];
  sparklinePlotType?: 'line' | 'bar';
  /** Semantic token ("primary", "danger", "success.400"), hex ("#006FEE"), or omit for theme default */
  sparklineColor?: string;
  sparklineArea?: boolean;

  // Radar
  radar?: {
    metrics: (LocalizedString | RadarMetric)[];
    max?: number;
    startAngle?: number;
  };

  // Funnel
  funnelCurve?: 'linear' | 'bump' | 'pyramid' | 'step';
}

export interface TableColumn {
  field: string;
  headerName: LocalizedString;
  width?: number;
  flex?: number;
  type?: 'string' | 'number' | 'date' | 'boolean';
  renderAs?: 'chip' | 'progress' | 'link' | 'badge';
  cellClassName?: string;
  headerClassName?: string;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
}

export interface TableBlock {
  type: 'table';
  title?: LocalizedString;
  pageSize?: number;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  density?: 'compact' | 'standard' | 'comfortable';
  showCellBorders?: boolean;
  showColumnBorders?: boolean;
  striped?: boolean;
  headerFilters?: boolean;
  columnPinning?: { left?: string[]; right?: string[] };
  columnGroups?: Array<{
    groupId: string;
    headerName: LocalizedString;
    children: Array<{ field: string }>;
  }>;
  autoHeight?: boolean;
  hideFooter?: boolean;
}

export interface DividerBlock {
  type: 'divider';
}

export interface UIShowcaseBlock {
  type: 'uiShowcase';
  title?: LocalizedString;
  sections?: (
    | 'buttons'
    | 'inputs'
    | 'selection'
    | 'chips'
    | 'progress'
    | 'navigation'
    | 'avatars'
    | 'accordion'
    | 'datePickers'
    | 'treeView'
    | 'alerts'
  )[];
}

export interface CalloutBlock {
  type: 'callout';
  severity: 'info' | 'success' | 'warning' | 'error';
  title?: LocalizedString;
  content: LocalizedString;
}

export interface GridBlock {
  type: 'grid';
  columns: number;
  gap?: number;
  blocks: ReportBlock[];
}

export type ReportBlock =
  | HeadingBlock
  | MarkdownBlock
  | MetricsBlock
  | ChartBlock
  | TableBlock
  | DividerBlock
  | CalloutBlock
  | GridBlock
  | UIShowcaseBlock;

export interface ReportConfig {
  blocks: ReportBlock[];
}

export interface Report {
  title: LocalizedString;
  description?: LocalizedString;
  config: ReportConfig;
  createdAt: string;
}

export interface ReportListItem {
  id: string;
  slug: string;
  token: string;
  title: LocalizedString;
  description?: LocalizedString;
  createdAt: string;
  updatedAt: string;
}
