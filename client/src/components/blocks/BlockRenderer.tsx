import { memo, type ComponentType } from 'react';
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
import { UIShowcaseBlock } from './UIShowcaseBlock';
import { TabsBlock } from './TabsBlock';
import { FilterBlock } from './FilterBlock';
import { DynamicDataBlock } from './DynamicDataBlock';
import { FilterBarBlock } from './FilterBarBlock';

// Block Registry: allows registering custom block renderers at runtime.
// Adding a new block type only requires calling registerBlock() in your entry point.
const blockRegistry = new Map<string, ComponentType<{ block: ReportBlock }>>();

export function registerBlock(type: string, component: ComponentType<{ block: ReportBlock }>) {
  blockRegistry.set(type, component);
}

export function getRegisteredBlock(type: string): ComponentType<{ block: ReportBlock }> | undefined {
  return blockRegistry.get(type);
}

interface Props {
  block: ReportBlock;
}

function BlockRendererInner({ block }: Props) {
  const registered = getRegisteredBlock(block.type);
  if (registered) {
    const Custom = registered;
    return <Custom block={block} />;
  }

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
    case 'uiShowcase':
      return <UIShowcaseBlock block={block} />;
    case 'tabs':
      return <TabsBlock block={block} />;
    case 'filter':
      return <FilterBlock block={block} />;
    case 'dynamicData':
      return <DynamicDataBlock block={block} />;
    case 'filterBar':
      return <FilterBarBlock block={block} />;
    default: {
      const exhaustiveBlock = block as { type: string };
      return (
        <Typography color="error">
          Unknown block type: {exhaustiveBlock.type}
        </Typography>
      );
    }
  }
}

export const BlockRenderer = memo(BlockRendererInner);
