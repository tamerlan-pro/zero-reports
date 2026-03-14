import { z } from 'zod';

export const LocalizedStringSchema = z.union([
  z.string().min(1),
  z.record(z.string(), z.string()),
]);

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
