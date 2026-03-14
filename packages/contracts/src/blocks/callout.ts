import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const CalloutBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('callout'),
  severity: z.enum(['info', 'success', 'warning', 'error']),
  title: LocalizedStringSchema.optional(),
  content: LocalizedStringSchema,
});

export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;
