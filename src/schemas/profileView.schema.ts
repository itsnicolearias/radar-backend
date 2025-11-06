import { z } from 'zod';

export const viewProfileSchema = z.object({

    viewedId: z.string().uuid("Invalid viewer ID")

});
