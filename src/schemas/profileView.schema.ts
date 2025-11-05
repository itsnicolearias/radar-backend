import { z } from 'zod';

export const viewProfileSchema = z.object({
  body: z.object({
    viewedId: z.number(),
  }),
});
