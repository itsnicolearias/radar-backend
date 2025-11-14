import { z } from "zod"

export const getNearbyUsersSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(100).max(50000).optional().default(1000),
})

export type GetNearbyUsersInput = z.infer<typeof getNearbyUsersSchema>
