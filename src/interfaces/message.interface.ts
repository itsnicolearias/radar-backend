import type { ISignalResponse } from './signal.interface';

export interface IMessageResponse {
  messageId: string;
  senderId: string;
  receiverId:string;
  content: string | null;
  type: 'text' | 'image' | 'audio';
  mediaKey: string | null;
  mediaMimeType: string | null;
  mediaDuration: number | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  Signal?: ISignalResponse;
}

export interface ILastMessage {
  content: string | null;
  createdAt: Date;
  isRead: boolean;
  senderId: string;
  type: 'text' | 'image' | 'audio';
  mediaKey: string | null;
  mediaMimeType: string | null;
  mediaDuration: number | null;
}

export interface IConversationUser {
  userId: string;
  displayName: string | null;
  isVerified: boolean;
  Profile: {
    photoUrl: string | null;
  }
}

export interface IConversation {
  conversationId: string;
  user: IConversationUser;
  lastMessage: ILastMessage;
  unreadCount: number;
}

export interface IConversationsResponse {
  conversations: IConversation[];
  total: number;
}

export interface IMarkAsReadResponse {
  message: string;
}

export interface IUnreadMessagesResponse {
  count: number;
}

export interface MessageAttributes {
  messageId: string;
  senderId: string;
  receiverId: string;
  signalId?: string | null;
  content: string | null;
  type: 'text' | 'image' | 'audio';
  mediaKey: string | null;
  mediaMimeType: string | null;
  mediaDuration: number | null;
  isRead: boolean;
  iv?: string | null;
  authTag?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes extends Omit<MessageAttributes, 'messageId'>, Record<string, unknown> {}
