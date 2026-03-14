import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const MetricItemSchema = z.object({
  label: LocalizedStringSchema,
  value: z.union([z.string(), z.number()]),
  delta: LocalizedStringSchema.optional(),
  deltaType: z.enum(['positive', 'negative', 'neutral']).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const MetricsBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('metrics'),
  columns: z.number().int().min(1).max(12).optional(),
  items: z.array(MetricItemSchema).min(1),
});

export type MetricItem = z.infer<typeof MetricItemSchema>;
export type MetricsBlock = z.infer<typeof MetricsBlockSchema>;
