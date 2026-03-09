import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { HeadingBlock as HeadingBlockType } from '../../types/report';
import { resolveLocale } from '../../utils/locale';

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
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const variant = variantMap[block.level] || 'h3';

  return (
    <Box>
      <Typography variant={variant}>{resolveLocale(block.content, lang)}</Typography>
      {block.subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {resolveLocale(block.subtitle, lang)}
        </Typography>
      )}
    </Box>
  );
}
