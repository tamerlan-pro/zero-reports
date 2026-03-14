import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const HeadingBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  content: LocalizedStringSchema,
  subtitle: LocalizedStringSchema.optional(),
});

export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;
