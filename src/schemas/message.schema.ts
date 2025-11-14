import { z } from "zod"

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
  content: z.string().min(1, "Message content is required").max(5000, "Message too long"),
  signalId: z.string().uuid("Invalid signal ID").optional(),
})

export const markAsReadSchema = z.object({
  messageIds: z.array(z.string().uuid()),
});

export const getRecentConversationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  all: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
