import { Typography, Box } from '@mui/material';
import type { HeadingBlock as HeadingBlockType } from '../../types/report';

const variantMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

interface Props {
  block: HeadingBlockType;
}

export function HeadingBlock({ block }: Props) {
  const variant = variantMap[block.level] || 'h3';

  return (
    <Box>
      <Typography variant={variant}>{block.content}</Typography>
      {block.subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {block.subtitle}
        </Typography>
      )}
    </Box>
  );
}
