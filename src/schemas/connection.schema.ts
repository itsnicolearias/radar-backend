import { z } from "zod"
import { ConnectionStatus } from "../interfaces/enums"

export const createConnectionSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
})

export const updateConnectionSchema = z.object({
  status: z.nativeEnum(ConnectionStatus),
})

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>
