import { Box } from '@mui/material';
import type { FilterBarBlock as FilterBarBlockType } from '../../types/report';
import { FilterBlock } from './FilterBlock';

interface Props {
  block: FilterBarBlockType;
}

export function FilterBarBlock({ block }: Props) {
  const gap = block.gap ?? 2;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: 'flex-end' }}>
      {block.blocks.map((filter, i) => (
        <FilterBlock key={filter.filterId ?? i} block={filter} />
      ))}
    </Box>
  );
}
