export interface MessageAttributes {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
  iv: string | null;
  authTag: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface MessageCreationAttributes {
  senderId: string;
  receiverId: string;
  content: string;
  iv?: string;
  authTag?: string;
  isRead?: boolean;
}
