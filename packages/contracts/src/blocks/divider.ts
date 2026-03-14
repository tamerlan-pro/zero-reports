import { z } from 'zod';

export const DividerBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('divider'),
});

export type DividerBlock = z.infer<typeof DividerBlockSchema>;
