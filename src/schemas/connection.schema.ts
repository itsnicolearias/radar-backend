import { z } from "zod"

export const createConnectionSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
})

export const updateConnectionSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
})

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>
