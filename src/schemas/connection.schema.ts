import { z } from "zod"
import { _ConnectionStatus } from "../interfaces/connection.interface"

export const createConnectionSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
})

export const updateConnectionSchema = z.object({
  status: z.nativeEnum(_ConnectionStatus),
})

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>
