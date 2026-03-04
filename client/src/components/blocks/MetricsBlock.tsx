import { Box, Paper, Typography, Grid } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import type { MetricsBlock as MetricsBlockType, MetricItem } from '../../types/report';
import { resolveColor } from '../../utils/resolveColor';

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

interface MetricCardOwnerState {
  accentColor: string;
}

const MetricCardRoot = styled(Paper, {
  name: 'ZrMetricCard',
  slot: 'Root',
})<{ ownerState: MetricCardOwnerState }>(({ theme, ownerState }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  borderLeft: `3px solid ${ownerState.accentColor}`,
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: 'rgba(43, 43, 45, 1)',
    borderLeftColor: ownerState.accentColor,
    boxShadow: '0px 6px 14px 0px rgba(105, 104, 104, 0.35)',
    transform: 'translateY(-1px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha(ownerState.accentColor, 0.08)} 0%, transparent 60%)`,
    pointerEvents: 'none',
  },
}));

const deltaIconMap: Record<string, string> = {
  positive: 'solar:arrow-right-up-bold-duotone',
  negative: 'solar:arrow-right-down-bold-duotone',
};
const DELTA_ICON_DEFAULT = 'solar:arrow-right-bold-duotone';

function MetricCard({ item }: { item: MetricItem }) {
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
    <MetricCardRoot ownerState={{ accentColor }}>
      {iconName && (
        <Box
          sx={(theme) => ({
            color: accentColor,
            opacity: theme.custom.iconOpacity.muted,
            mt: 0.5,
            display: 'flex',
          })}
        >
          <Icon icon={iconName} width={24} />
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.75rem',
          }}
        >
          {item.label}
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
            <Icon icon={deltaIcon} width={16} />
            <Typography
              variant="caption"
              sx={{ color: deltaColorToken, fontWeight: 500, fontSize: '0.813rem' }}
            >
              {item.delta}
            </Typography>
          </Box>
        )}
      </Box>
    </MetricCardRoot>
  );
}

interface Props {
  block: MetricsBlockType;
}

export function MetricsBlock({ block }: Props) {
  const columns = block.columns || 4;

  return (
    <Grid container spacing={2.5}>
      {block.items.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 12 / columns }}>
          <MetricCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}
