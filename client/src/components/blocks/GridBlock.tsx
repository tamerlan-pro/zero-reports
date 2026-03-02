import { Grid } from '@mui/material';
import type { GridBlock as GridBlockType } from '../../types/report';
import { BlockRenderer } from './BlockRenderer';

interface Props {
  block: GridBlockType;
}

export function GridBlock({ block }: Props) {
  const gap = block.gap ?? 3;
  const colSize = 12 / block.columns;

  return (
    <Grid container spacing={gap}>
      {block.blocks.map((childBlock, i) => (
        <Grid key={i} size={{ xs: 12, md: colSize }}>
          <BlockRenderer block={childBlock} />
        </Grid>
      ))}
    </Grid>
  );
}
