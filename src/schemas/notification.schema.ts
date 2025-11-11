import { z } from "zod"
import { NotificationType } from "../interfaces/enums"

export const markNotificationsAsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()),
})

export const createNotificationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  type: z.nativeEnum(NotificationType),
  message: z.string().min(1, "Message is required"),
})

export type MarkNotificationsAsReadInput = z.infer<typeof markNotificationsAsReadSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
