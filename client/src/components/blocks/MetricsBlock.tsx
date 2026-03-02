import { Box, Paper, Typography, Grid } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  AccountBalance,
  Percent,
  AttachMoney,
  Headphones,
  ShoppingCart,
  Visibility,
  Speed,
  Star,
} from '@mui/icons-material';
import type { MetricsBlock as MetricsBlockType, MetricItem } from '../../types/report';

const iconMap: Record<string, React.ElementType> = {
  trending_up: TrendingUp,
  trending_down: TrendingDown,
  trending_flat: TrendingFlat,
  people: People,
  account_balance: AccountBalance,
  percent: Percent,
  attach_money: AttachMoney,
  headphones: Headphones,
  shopping_cart: ShoppingCart,
  visibility: Visibility,
  speed: Speed,
  star: Star,
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
    borderColor: theme.palette.surface.level6,
    borderLeftColor: ownerState.accentColor,
    boxShadow: theme.shadows[4],
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

function MetricCard({ item }: { item: MetricItem }) {
  const accentColor = item.color || '#42a5f5';

  const IconComponent = item.icon ? iconMap[item.icon] || TrendingFlat : null;

  const DeltaIcon =
    item.deltaType === 'positive'
      ? TrendingUp
      : item.deltaType === 'negative'
        ? TrendingDown
        : TrendingFlat;

  const deltaColorToken =
    item.deltaType === 'positive'
      ? 'success.main'
      : item.deltaType === 'negative'
        ? 'error.main'
        : 'text.secondary';

  return (
    <MetricCardRoot ownerState={{ accentColor }}>
      {IconComponent && (
        <Box
          sx={(theme) => ({
            color: accentColor,
            opacity: theme.custom.iconOpacity.muted,
            mt: 0.5,
          })}
        >
          <IconComponent fontSize="medium" />
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DeltaIcon sx={{ fontSize: 16, color: deltaColorToken }} />
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
