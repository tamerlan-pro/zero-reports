import { Typography } from '@mui/material';
import type { ReportBlock } from '../../types/report';
import { HeadingBlock } from './HeadingBlock';
import { MarkdownBlock } from './MarkdownBlock';
import { MetricsBlock } from './MetricsBlock';
import { ChartBlock } from './ChartBlock';
import { TableBlock } from './TableBlock';
import { DividerBlock } from './DividerBlock';
import { CalloutBlock } from './CalloutBlock';
import { GridBlock } from './GridBlock';

interface Props {
  block: ReportBlock;
}

export function BlockRenderer({ block }: Props) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} />;
    case 'markdown':
      return <MarkdownBlock block={block} />;
    case 'metrics':
      return <MetricsBlock block={block} />;
    case 'chart':
      return <ChartBlock block={block} />;
    case 'table':
      return <TableBlock block={block} />;
    case 'divider':
      return <DividerBlock />;
    case 'callout':
      return <CalloutBlock block={block} />;
    case 'grid':
      return <GridBlock block={block} />;
    default:
      return (
        <Typography color="error">
          Unknown block type: {(block as { type: string }).type}
        </Typography>
      );
  }
}
