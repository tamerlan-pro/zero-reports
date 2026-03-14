import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const MarkdownBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('markdown'),
  content: LocalizedStringSchema,
});

export type MarkdownBlock = z.infer<typeof MarkdownBlockSchema>;
