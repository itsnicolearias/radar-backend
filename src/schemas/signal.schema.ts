import { z } from 'zod';

export const sendSignalSchema = z.object({
  body: z.object({
    note: z.string().optional(),
  }),
});
