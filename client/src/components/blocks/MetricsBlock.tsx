import { Box, Paper, Typography, Grid } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import type { MetricsBlock as MetricsBlockType, MetricItem } from '../../types/report';
import { resolveColor } from '../../utils/resolveColor';
import { resolveLocale } from '../../utils/locale';

const iconMap: Record<string, string> = {
  trending_up: 'solar:arrow-right-up-bold-duotone',
  trending_down: 'solar:arrow-right-down-bold-duotone',
  trending_flat: 'solar:arrow-right-bold-duotone',
  people: 'solar:users-group-rounded-bold-duotone',
  account_balance: 'solar:buildings-2-bold-duotone',
  percent: 'solar:sale-bold-duotone',
  attach_money: 'solar:dollar-minimalistic-bold-duotone',
  headphones: 'solar:headphones-round-bold-duotone',
  shopping_cart: 'solar:cart-large-bold-duotone',
  visibility: 'solar:eye-bold-duotone',
  speed: 'solar:speedometer-bold-duotone',
  star: 'solar:star-bold-duotone',
};

const DELTA_ICON_DEFAULT = 'solar:arrow-right-bold-duotone';
const deltaIconMap: Record<string, string> = {
  positive: 'solar:arrow-right-up-bold-duotone',
  negative: 'solar:arrow-right-down-bold-duotone',
};

function MetricCard({ item, lang }: { item: MetricItem; lang: string }) {
  const theme = useTheme();
  const accentColor = resolveColor(item.color, theme) || theme.palette.primary.main;
  const iconName = item.icon ? iconMap[item.icon] || DELTA_ICON_DEFAULT : null;
  const deltaIcon = deltaIconMap[item.deltaType || ''] || DELTA_ICON_DEFAULT;

  const deltaColorToken =
    item.deltaType === 'positive'
      ? 'success.main'
      : item.deltaType === 'negative'
        ? 'error.main'
        : 'text.secondary';

  return (
    <Paper
      variant="metric"
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        borderLeft: `3px solid ${accentColor}`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderLeftColor: accentColor,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(accentColor, 0.08)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {iconName && (
        <Box
          sx={(t) => ({
            color: accentColor,
            opacity: t.custom.iconOpacity.muted,
            mt: 0.5,
            display: 'flex',
          })}
        >
          <Icon icon={iconName} width={theme.custom.iconSize.lg} />
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={(t) => ({
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: t.heroui.typography.tiny.fontSize,
          })}
        >
          {resolveLocale(item.label, lang)}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            my: 0.5,
            lineHeight: 1.2,
          }}
        >
          {item.value}
        </Typography>
        {item.delta && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: deltaColorToken }}>
            <Icon icon={deltaIcon} width={theme.custom.iconSize.sm} />
            <Typography
              variant="caption"
              sx={(t) => ({
                color: deltaColorToken,
                fontWeight: 500,
                fontSize: t.heroui.typography.small.fontSize,
              })}
            >
              {resolveLocale(item.delta, lang)}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

interface Props {
  block: MetricsBlockType;
}

export function MetricsBlock({ block }: Props) {
  const { i18n } = useTranslation();
  const columns = block.columns || 4;

  return (
    <Grid container spacing={2.5}>
      {block.items.map((item, i) => (
        <Grid key={item.label?.toString() ?? i} size={{ xs: 12, sm: 6, md: 12 / columns }}>
          <MetricCard item={item} lang={i18n.language} />
        </Grid>
      ))}
    </Grid>
  );
}
