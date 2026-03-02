import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart, PieChart, ScatterChart } from '@mui/x-charts-pro';
import { Gauge } from '@mui/x-charts/Gauge';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import type { ChartBlock as ChartBlockType } from '../../types/report';
import { formatNumber } from '../../utils/format';

interface Props {
  block: ChartBlockType;
}

export function ChartBlock({ block }: Props) {
  const theme = useTheme();
  const chartColors = theme.custom.chartColors;
  const height = block.height || 350;

  const seriesColors = block.series.map(
    (s, i) => s.color || chartColors[i % chartColors.length],
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
      case 'line':
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
              '.MuiAreaElement-root': {
                opacity: 0.15,
              },
              '.MuiLineElement-root': {
                strokeWidth: 2.5,
              },
            }}
          />
        );

      case 'bar':
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
              dataKey: s.dataKey,
              label: s.label,
              color: seriesColors[i],
              valueFormatter: (v: number | null) => formatNumber(v ?? 0),
            }))}
            height={height}
            grid={{ horizontal: true }}
            borderRadius={6}
            {...legendProps}
          />
        );

      case 'pie':
        return (
          <PieChart
            series={[
              {
                data: block.data.map((d, i) => ({
                  id: (d.id as number) ?? i,
                  value: d[block.series[0]?.dataKey || 'value'] as number,
                  label: (d.label as string) || `#${i}`,
                  color:
                    (d.color as string) ||
                    chartColors[i % chartColors.length],
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
          />
        );

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

      case 'sparkline':
        return (
          <SparkLineChart
            data={block.sparklineData || []}
            height={height > 150 ? 150 : height}
            plotType={block.sparklinePlotType || 'line'}
            area={block.sparklineArea}
            color={block.sparklineColor || seriesColors[0]}
            curve="catmullRom"
            showTooltip
            showHighlight
          />
        );

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
                    (d.color as string) ||
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
