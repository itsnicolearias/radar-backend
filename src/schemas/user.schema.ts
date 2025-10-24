import { z } from "zod"

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  invisibleMode: z.boolean().optional(),
})

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
