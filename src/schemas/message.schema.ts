import { z } from "zod"

const textMessageSchema = z.object({
  type: z.literal('text'),
  receiverId: z.string().uuid("Invalid receiver ID"),
  content: z.string().min(1, "Message content is required").max(5000, "Message too long"),
  signalId: z.string().uuid("Invalid signal ID").optional(),
});

const imageMessageSchema = z.object({
  type: z.literal('image'),
  receiverId: z.string().uuid("Invalid receiver ID"),
  mediaKey: z.string(),
  mediaMimeType: z.string(),
  signalId: z.string().uuid("Invalid signal ID").optional(),
});

const audioMessageSchema = z.object({
  type: z.literal('audio'),
  receiverId: z.string().uuid("Invalid receiver ID"),
  mediaKey: z.string(),
  mediaMimeType: z.string(),
  mediaDuration: z.number(),
  signalId: z.string().uuid("Invalid signal ID").optional(),
});

export const sendMessageSchema = z.discriminatedUnion('type', [
  textMessageSchema,
  imageMessageSchema,
  audioMessageSchema,
]);

export const markAsReadSchema = z.object({
  messageIds: z.array(z.string().uuid()),
});

export const getRecentConversationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  all: z.string().optional(),
});

export const getUploadUrlSchema = z.object({
  type: z.enum(['image', 'audio']),
  mimeType: z.string(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
