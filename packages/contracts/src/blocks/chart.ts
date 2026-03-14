import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const ChartSeriesSchema = z.object({
  dataKey: z.string(),
  label: LocalizedStringSchema.optional(),
  color: z.string().optional(),
  area: z.boolean().optional(),
});

export const ChartAxisSchema = z.object({
  dataKey: z.string(),
  label: LocalizedStringSchema.optional(),
  scaleType: z.enum(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']).optional(),
});

export const RadarMetricSchema = z.union([
  LocalizedStringSchema,
  z.object({
    name: LocalizedStringSchema,
    min: z.number().optional(),
    max: z.number().optional(),
  }),
]);

export const ChartBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('chart'),
  title: LocalizedStringSchema.optional(),
  chartType: z.enum(['line', 'bar', 'pie', 'scatter', 'gauge', 'sparkline', 'radar', 'funnel', 'heatmap']),
  height: z.number().int().positive().optional(),
  xAxis: ChartAxisSchema.optional(),
  yAxis: ChartAxisSchema.optional(),
  series: z.array(ChartSeriesSchema),
  data: z.array(z.record(z.string(), z.unknown())),
  gaugeValue: z.number().optional(),
  gaugeMin: z.number().optional(),
  gaugeMax: z.number().optional(),
  gaugeStartAngle: z.number().optional(),
  gaugeEndAngle: z.number().optional(),
  sparklineData: z.array(z.number()).optional(),
  sparklinePlotType: z.enum(['line', 'bar']).optional(),
  sparklineColor: z.string().optional(),
  sparklineArea: z.boolean().optional(),
  radar: z.object({
    metrics: z.array(RadarMetricSchema),
    max: z.number().optional(),
    startAngle: z.number().optional(),
  }).optional(),
  funnelCurve: z.enum(['linear', 'bump', 'pyramid', 'step']).optional(),
});

export type ChartSeries = z.infer<typeof ChartSeriesSchema>;
export type ChartAxis = z.infer<typeof ChartAxisSchema>;
export type ChartBlock = z.infer<typeof ChartBlockSchema>;
