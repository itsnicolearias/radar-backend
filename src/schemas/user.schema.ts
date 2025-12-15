import { z } from "zod"

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  displayName: z.string().min(1).max(50).optional(),
  birthDate: z.date().optional(),
  invisibleMode: z.boolean().optional(),
})

export const toggleVisibilitySchema = z.object({
  isVisible: z.boolean(),
})

export const updateProfilePhotoSchema = z.object({
  photoUrl: z.string().url(),
})

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ToggleVisibilityInput = z.infer<typeof toggleVisibilitySchema>
export type UpdateProfilePhotoInput = z.infer<typeof updateProfilePhotoSchema>
