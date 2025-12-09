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

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *         age:
 *           type: integer
 *         country:
 *           type: string
 *         province:
 *           type: string
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         showAge:
 *           type: boolean
 *         showLocation:
 *           type: boolean
 *         distanceRadius:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         displayName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date-time
 *         invisibleMode:
 *           type: boolean
 */
export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  age: z.number().int().min(18).max(120).optional(),
  country: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  interests: z.array(z.string()).optional(),
  showAge: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  distanceRadius: z.number().int().min(100).max(50000).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  displayName: z.string().min(1).max(50).optional(),
  birthDate: z.string().datetime().optional(),
  invisibleMode: z.boolean().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
