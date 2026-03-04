import { useId } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart, PieChart, ScatterChart } from '@mui/x-charts-pro';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { Gauge } from '@mui/x-charts/Gauge';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import type { ChartBlock as ChartBlockType } from '../../types/report';
import { formatNumber } from '../../utils/format';
import { resolveColor } from '../../utils/resolveColor';

function darkenHex(hex: string, factor = 0.55): string {
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Unified SVG gradient definitions for charts.
 *
 * variant="fade"  — same color, opacity 100% → 10% (+ stroke gradient 100% → 35%)
 * variant="tonal" — full opacity, color transitions from bright (400) to dark (200)
 */
function ChartGradient({
  colors,
  colorsDark,
  uid,
  variant,
}: {
  colors: string[];
  colorsDark?: string[];
  uid: string;
  variant: 'fade' | 'tonal';
}) {
  const { top, height } = useDrawingArea();

  if (variant === 'tonal') {
    return (
      <defs>
        {colors.map((color, i) => (
          <linearGradient
            key={i}
            id={`${uid}-${i}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={colorsDark?.[i] || darkenHex(color)} stopOpacity={1} />
          </linearGradient>
        ))}
      </defs>
    );
  }

  return (
    <defs>
      {colors.map((color, i) => (
        <linearGradient
          key={i}
          id={`${uid}-${i}`}
          x1="0"
          x2="0"
          y1={String(top)}
          y2={String(top + height)}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.1} />
        </linearGradient>
      ))}
      {colors.map((color, i) => (
        <linearGradient
          key={`s${i}`}
          id={`${uid}-s-${i}`}
          x1="0"
          x2="0"
          y1={String(top)}
          y2={String(top + height)}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.35} />
        </linearGradient>
      ))}
    </defs>
  );
}

/**
 * Radial gradient for pie / donut charts.
 * Center (0%) = bright 400-weight, edge (100%) = dark 200-weight.
 *
 * MUI X Charts wraps pie arcs in <g transform="translate(cx, cy)">,
 * so the local coordinate origin (0, 0) is the pie center.
 */
function PieGradient({
  colors,
  colorsDark,
  uid,
}: {
  colors: string[];
  colorsDark: string[];
  uid: string;
}) {
  const { width, height } = useDrawingArea();
  const r = Math.min(width, height) * 0.45;

  return (
    <defs>
      {colors.map((color, i) => (
        <radialGradient
          key={i}
          id={`${uid}-pie-${i}`}
          cx="0"
          cy="0"
          r={String(r)}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colorsDark[i]} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );
}

interface Props {
  block: ChartBlockType;
}

export function ChartBlock({ block }: Props) {
  const theme = useTheme();
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const chartColors = theme.custom.chartColors;
  const chartColorPairs = theme.custom.chartColorPairs;
  const height = block.height || 350;

  const seriesColors = block.series.map(
    (s, i) => resolveColor(s.color, theme) || chartColors[i % chartColors.length],
  );
  const seriesColorsDark = seriesColors.map(
    (c) => chartColorPairs[c] || darkenHex(c),
  );

  const legendProps = {
    slotProps: {
      legend: {
        position: { vertical: 'bottom' as const, horizontal: 'center' as const },
        padding: { top: 20 },
      },
    },
  };

  const content = (() => {
    switch (block.chartType) {
      case 'line': {
        const hasArea = block.series.some((s) => s.area);
        const areaSx = hasArea
          ? block.series.reduce<Record<string, { fill: string }>>(
              (acc, s, i) => {
                if (s.area) {
                  acc[`.MuiAreaElement-series-${uid}-${i}`] = {
                    fill: `url(#${uid}-${i})`,
                  };
                }
                return acc;
              },
              {},
            )
          : {};

        return (
          <LineChart
            dataset={block.data as Record<string, number | string>[]}
            xAxis={[
              {
                dataKey: block.xAxis?.dataKey || 'x',
                label: block.xAxis?.label,
                scaleType: (block.xAxis?.scaleType as 'band') || 'band',
              },
            ]}
            series={block.series.map((s, i) => ({
              id: `${uid}-${i}`,
              dataKey: s.dataKey,
              label: s.label,
              color: seriesColors[i],
              area: s.area,
              showMark: false,
              curve: 'catmullRom' as const,
              valueFormatter: (v: number | null) => formatNumber(v ?? 0),
            }))}
            height={height}
            grid={{ horizontal: true }}
            {...legendProps}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2.5,
              },
              ...areaSx,
            }}
          >
            {hasArea && (
              <ChartGradient colors={seriesColors} uid={uid} variant="fade" />
            )}
          </LineChart>
        );
      }

      case 'bar': {
        const barSx = block.series.reduce<Record<string, { fill: string }>>(
          (acc, _s, i) => {
            acc[`.MuiBarElement-series-bar-${uid}-${i}`] = {
              fill: `url(#${uid}-${i})`,
            };
            return acc;
          },
          {},
        );

        return (
          <BarChart
            dataset={block.data as Record<string, number | string>[]}
            xAxis={[
              {
                dataKey: block.xAxis?.dataKey || 'x',
                label: block.xAxis?.label,
                scaleType: (block.xAxis?.scaleType as 'band') || 'band',
              },
            ]}
            series={block.series.map((s, i) => ({
              id: `bar-${uid}-${i}`,
              dataKey: s.dataKey,
              label: s.label,
              color: seriesColors[i],
              valueFormatter: (v: number | null) => formatNumber(v ?? 0),
            }))}
            height={height}
            grid={{ horizontal: true }}
            borderRadius={6}
            {...legendProps}
            sx={barSx}
          >
            <ChartGradient
              colors={seriesColors}
              colorsDark={seriesColorsDark}
              uid={uid}
              variant="tonal"
            />
          </BarChart>
        );
      }

      case 'pie': {
        const pieColors = block.data.map(
          (d, i) =>
            resolveColor(d.color as string, theme) ||
            chartColors[i % chartColors.length],
        );
        const pieColorsDark = pieColors.map(
          (c) => chartColorPairs[c] || darkenHex(c),
        );
        const pieSx = pieColors.reduce<Record<string, { fill: string }>>(
          (acc, _, i) => {
            acc[`& .MuiPieArc-root:nth-of-type(${i + 1})`] = {
              fill: `url(#${uid}-pie-${i})`,
            };
            return acc;
          },
          {},
        );

        return (
          <PieChart
            series={[
              {
                data: block.data.map((d, i) => ({
                  id: (d.id as number) ?? i,
                  value: d[block.series[0]?.dataKey || 'value'] as number,
                  label: (d.label as string) || `#${i}`,
                  color: pieColors[i],
                })),
                arcLabel: (item) => `${item.value}`,
                arcLabelMinAngle: 25,
                innerRadius: 40,
                outerRadius: '90%',
                paddingAngle: 2,
                cornerRadius: 5,
                cx: '50%',
              },
            ]}
            height={height}
            {...legendProps}
            sx={pieSx}
          >
            <PieGradient
              colors={pieColors}
              colorsDark={pieColorsDark}
              uid={uid}
            />
          </PieChart>
        );
      }

      case 'scatter':
        return (
          <ScatterChart
            series={block.series.map((s, i) => ({
              data: block.data.map((d) => ({
                x: d[block.xAxis?.dataKey || 'x'] as number,
                y: d[s.dataKey] as number,
                id: String(d.id ?? Math.random()),
              })),
              label: s.label,
              color: seriesColors[i],
              markerSize: 6,
            }))}
            height={height}
            grid={{ horizontal: true, vertical: true }}
            {...legendProps}
          />
        );

      case 'gauge':
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Gauge
              width={200}
              height={height > 250 ? 250 : height}
              value={block.gaugeValue ?? 0}
              valueMin={block.gaugeMin ?? 0}
              valueMax={block.gaugeMax ?? 100}
              startAngle={block.gaugeStartAngle ?? -110}
              endAngle={block.gaugeEndAngle ?? 110}
              sx={{
                '& .MuiGauge-valueText': {
                  fontSize: 32,
                  fontWeight: 600,
                  fill: theme.palette.text.primary,
                },
                '& .MuiGauge-valueArc': {
                  fill: seriesColors[0] || theme.palette.info.main,
                },
                '& .MuiGauge-referenceArc': {
                  fill: theme.palette.surface.level4,
                },
              }}
              text={({ value, valueMax }) => `${value} / ${valueMax}`}
            />
          </Box>
        );

      case 'sparkline': {
        const sparkColor = resolveColor(block.sparklineColor, theme) || seriesColors[0];
        const sparkArea = block.sparklineArea;
        const isBar = block.sparklinePlotType === 'bar';

        return (
          <SparkLineChart
            data={block.sparklineData || []}
            height={height > 150 ? 150 : height}
            plotType={block.sparklinePlotType || 'line'}
            area={sparkArea}
            color={sparkColor}
            curve="catmullRom"
            showTooltip
            showHighlight
            sx={{
              ...(sparkArea && {
                '.MuiAreaElement-root': { fill: `url(#${uid}-0)` },
              }),
              ...(isBar && {
                '.MuiBarElement-root': {
                  fill: `url(#${uid}-0)`,
                  stroke: `url(#${uid}-s-0)`,
                  strokeWidth: 1,
                  rx: 3,
                  ry: 3,
                },
              }),
            }}
          >
            {(sparkArea || isBar) && (
              <ChartGradient colors={[sparkColor]} uid={uid} variant="fade" />
            )}
          </SparkLineChart>
        );
      }

      case 'radar':
        return (
          <RadarChart
            height={height}
            series={block.series.map((s, i) => ({
              label: s.label,
              data: block.data.map((d) => d[s.dataKey] as number),
              color: seriesColors[i],
              fillArea: s.area,
            }))}
            radar={{
              metrics: (block.radar?.metrics || []) as string[],
              max: block.radar?.max,
              startAngle: block.radar?.startAngle,
            }}
          />
        );

      case 'funnel':
        return (
          <FunnelChart
            series={[
              {
                data: block.data.map((d, i) => ({
                  value: (d.value as number) ?? 0,
                  label: (d.label as string) || `#${i}`,
                  color:
                    resolveColor(d.color as string, theme) ||
                    chartColors[i % chartColors.length],
                })),
                curve: block.funnelCurve || 'bump',
              },
            ]}
            height={height}
          />
        );

      case 'heatmap':
        return (
          <Heatmap
            xAxis={[{
              data: block.xAxis
                ? block.data
                    .map((d) => d[block.xAxis!.dataKey] as string)
                    .filter((v, i, a) => a.indexOf(v) === i)
                : [],
            }]}
            yAxis={[{
              data: block.yAxis
                ? block.data
                    .map((d) => d[block.yAxis!.dataKey] as string)
                    .filter((v, i, a) => a.indexOf(v) === i)
                : [],
            }]}
            series={[{
              data: block.data.map((d) => [
                d.x as number,
                d.y as number,
                d.value as number,
              ] as [number, number, number]),
            }]}
            height={height}
          />
        );

      default:
        return (
          <Typography color="text.secondary">
            Unknown chart type: {block.chartType}
          </Typography>
        );
    }
  })();

  return (
    <Paper sx={{ p: 3, overflow: 'hidden' }}>
      {block.title && (
        <Typography variant="h6" sx={{ mb: 2.5 }}>
          {block.title}
        </Typography>
      )}
      <Box sx={{ mx: -1 }}>{content}</Box>
    </Paper>
  );
}
