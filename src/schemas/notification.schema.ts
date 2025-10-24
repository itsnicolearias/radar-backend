import { z } from "zod"

export const markNotificationsAsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()),
})

export type MarkNotificationsAsReadInput = z.infer<typeof markNotificationsAsReadSchema>
