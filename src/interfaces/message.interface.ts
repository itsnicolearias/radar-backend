export interface MessageAttributes {
  messageId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
}

export interface MessageCreationAttributes {
  senderId: string
  receiverId: string
  content: string
  isRead?: boolean
}
