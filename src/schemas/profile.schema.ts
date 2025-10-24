import { z } from "zod"

export const createProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  age: z.number().int().min(18).max(120).optional(),
  country: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  interests: z.array(z.string()).optional(),
  showAge: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  distanceRadius: z.number().int().min(100).max(50000).optional(),
})

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  age: z.number().int().min(18).max(120).optional(),
  country: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  interests: z.array(z.string()).optional(),
  showAge: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  distanceRadius: z.number().int().min(100).max(50000).optional(),
})

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
