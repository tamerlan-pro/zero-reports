import { z } from 'zod';
import { LocalizedStringSchema } from './common';

export const UIShowcaseSectionSchema = z.enum([
  'buttons', 'inputs', 'selection', 'chips', 'progress',
  'navigation', 'avatars', 'accordion', 'datePickers', 'treeView', 'alerts',
]);

export const UIShowcaseBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal('uiShowcase'),
  title: LocalizedStringSchema.optional(),
  sections: z.array(UIShowcaseSectionSchema).optional(),
});

export type UIShowcaseBlock = z.infer<typeof UIShowcaseBlockSchema>;
