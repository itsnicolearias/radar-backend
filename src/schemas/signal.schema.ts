import { z } from 'zod';

export const sendSignalSchema = z.object({

    note: z.string().optional(),

});
